'use server'
import { User } from 'next-auth'
import { db } from './db'
import { businesses, businessTypes, shifts, users } from './schema'
import { desc, eq, ilike, sql } from 'drizzle-orm'

import { DEFAULT_BUSSINESS_TYPE } from '@/utils/constants'
import { revalidatePath } from 'next/cache'
import { UserAuthData } from '@/utils/validators'
import { hashPW } from '@/auth/authUtils'

/**
Naming of functions:
CREATE
READ/GET
UPDATE
DELETE
* Try to keep naming consistent with CRUD operations, that way it's easier to tell
* that this function is doing something with database, and it's a CRUD operation.
*/
interface UserAuthDataOld extends User {
  name: string
  phoneNumber: string
  password: string
}

// @!⛳IMP - `getExistingUser()` function is responsible for returning all data -
// -that session requires - when user is authenticated
export const getExistingUser = async (phNumber) => {
  // console.log('DB:: finding user...')
  const match = await db.query.users.findFirst({
    where: eq(users.phoneNumber, phNumber),
    columns: {
      createdAt: false,
      employmentStatus: false,
    },
  })
  if (!match) throw new Error(`No user found with ph:${phNumber}`)
  if (!match) {
    console.log(`🔴DB:: no match found`)
    return null
  }
  return match
}

export const createUser = async (userData: UserAuthData) => {
  const hashedPassword: string = await hashPW(userData.password)

  const createdUsers = await db
    .insert(users)
    .values({
      phoneNumber: userData.phoneNumber,
      name: userData.name,
      password: hashedPassword,
    })
    .returning()
  // Unlike query - which gives back single user (my guess is coz the name of function is - findFirst)
  // and what I didn't know OR realize was that .insert().values()
  // values - being plural returns an array and not a single user
  // so extracting it out
  const createdUser = createdUsers[0]
  return createdUser
}

export const createShift = async (shiftData: {
  employeeId: string
  businessId: string
  startUnixTimeSecs: string
  endTime: string | null
  notes: string | null
}) => {
  const shiftEmployee = shiftData?.employeeId
  // console.log('⚪DB:: Add shift of EMPLOYEE : ', shiftEmployee)
  // console.log(shiftData)

  const currEmployee = await db.query.users.findFirst({
    where: eq(users.id, shiftEmployee),
  })
  const isEmployeeWorking = currEmployee.currentWorkStatus
  if (isEmployeeWorking === 'on_shift') {
    throw new Error('User is already on shift')
  }

  return await db.transaction(async (tx) => {
    const shiftDate = new Date(shiftData.startUnixTimeSecs).toString()
    const insertedShift = await tx
      .insert(shifts)
      .values({
        ...shiftData,
        date: shiftDate,
      })
      .returning({
        id: shifts.id,
        businessId: shifts.businessId,
        startUnixTimeSecs: shifts.startUnixTimeSecs,
      })

    try {
      await tx.execute(sql`
          UPDATE users
          SET current_work_status = 'on_shift', current_shift_id = ${insertedShift[0].id}
          WHERE id = ${shiftData.employeeId}
          RETURNING *
        `)
    } catch (err) {
      console.error('Err:: could not update shifts ending time')
      console.error(err)
    }

    return insertedShift
  })
}

export const getShiftDetails = async () => {
  const shiftDetailsByDate = await db
    .select({
      startDate: sql`
        TO_CHAR(
          TO_TIMESTAMP(CAST(${shifts.startUnixTimeSecs} AS BIGINT)) AT TIME ZONE 'America/Halifax',
          'YYYY-MM-DD'
        )
      `,
      shifts: sql`
        array_agg(
          json_build_object(
            'id', ${shifts.id},
            'notes', ${shifts.notes},
            'startTimeAtlantic', TO_CHAR(
              TO_TIMESTAMP(CAST(${shifts.startUnixTimeSecs} AS BIGINT)) AT TIME ZONE 'America/Halifax',
              'HH24:MI'
            ),
            'endTimeAtlantic', TO_CHAR(
              TO_TIMESTAMP(CAST(${shifts.endUnixTimeSecs} AS BIGINT)) AT TIME ZONE 'America/Halifax',
              'HH24:MI'
            ),
            'employeeName', ${users.name},
            'businessName', ${businesses.name}
          )
        )
      `,
    })
    .from(shifts)
    .leftJoin(users, eq(shifts.employeeId, users.id))
    .leftJoin(businesses, eq(shifts.businessId, businesses.id))
    .groupBy(sql`TO_CHAR(
      TO_TIMESTAMP(CAST(${shifts.startUnixTimeSecs} AS BIGINT)) AT TIME ZONE 'America/Halifax',
      'YYYY-MM-DD'
    )`)
    .orderBy(desc(sql`TO_CHAR(
      TO_TIMESTAMP(CAST(${shifts.startUnixTimeSecs} AS BIGINT)) AT TIME ZONE 'America/Halifax',
      'YYYY-MM-DD'
    )`))
    .execute()

  // Convert the result to an object with dates as keys
  return Object.fromEntries(
    shiftDetailsByDate.map(({ startDate, shifts }) => [startDate, shifts])
  )
}

export const getAllShifts = async (employeeId: string) => {
  const allShifts = await db.query.shifts.findMany({
    where: eq(shifts.employeeId, employeeId),
    with: {
      business: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (shifts, { desc }) => [
      desc(shifts.serverDate),
      desc(shifts.serverStartTime),
    ],
  })
  return allShifts
}
export const getEmployeeWorkStatus = async (employeeId) => {
  let shiftStatus = await db.query.users.findFirst({
    where: eq(users.id, employeeId),
    columns: {
      id: true,
      name: true,
      currentWorkStatus: true,
      currentShiftId: true,
      phoneNumber: true,
    } as const,
  })
  return shiftStatus
}
export const updateShiftAsEnded = async (employeeId, endunixTimeMs) => {
  return await db.transaction(async (tx) => {
    // First, get the current shift ID
    const currentUser = await tx.query.users.findFirst({
      where: eq(users.id, employeeId),
    })

    if (!currentUser || !currentUser.currentShiftId) {
      throw new Error('User not found or not currently on shift')
    }

    const currentShiftId = currentUser?.currentShiftId

    // Update user status
    // // can't use drizzle.update coz it has some issues - so using sql
    // // https://github.com/drizzle-team/drizzle-orm/issues/2654
    await tx.execute(sql`
          UPDATE users
          SET current_work_status = 'off_shift', current_shift_id = NULL
          WHERE id = ${employeeId}
        `)

    // Update shift
    const endUnixTimeSecs = Math.floor(Number(endunixTimeMs) / 1000).toString()
    try {
      const updatedShift = await tx.execute(sql`
          UPDATE shifts
          SET end_unixtime_secs = ${endUnixTimeSecs}
          WHERE id = ${currentShiftId}
          RETURNING *
        `)
      return updatedShift[0]
    } catch (err) {
      console.error('Err:: could not update shifts ending time')
      console.error(err)
    }
  })
}

const createBusinessTypes = async () => {
  const data = await db
    .insert(businessTypes)
    .values([{ name: DEFAULT_BUSSINESS_TYPE }])
    .returning()
  return data[0]
}

const getBusinessTypeId = async (businessType: string) => {
  // for now returns farm type, if it doesn't exist -
  // it'll be created (to avoid crashing for users)
  let typeId = undefined
  try {
    typeId = await db.query.businessTypes.findFirst({
      where: ilike(businessTypes?.name, businessType),
    })
    if (!typeId) {
      typeId = await createBusinessTypes()
      typeId = typeId[0]
    }
    console.log('Btype: ', typeId)
    return typeId?.id
  } catch (err) {
    console.error('Could nott find business of type : ', businessType)
  }
}

export const createBusinesses = async (ownerId, formData: FormData) => {
  try {
    const businessNames = formData.getAll('businessname')
    const bTypeID = await getBusinessTypeId(
      DEFAULT_BUSSINESS_TYPE.toLowerCase(),
    )
    console.log('bType: ', bTypeID)
    // b-name, ownerId, location type
    const businessesData = businessNames.map((businessName) => {
      return {
        name: businessName.toString(),
        ownerId: ownerId,
        location: 'N/A',
        businessTypeId: bTypeID,
      }
    })
    console.log('👍 Business Created, ', businessesData)

    await db.insert(businesses).values(businessesData)

    revalidatePath('/businesses/@allBusinesses')
  } catch (err) {
    console.error(err)
    console.error('Could not create ')
    throw new Error('Could not create business')
  }
}
export const getAllBusinesses = async (ownerId: string) => {
  const ownedBusinesses = await db.query.businesses.findMany({
    where: eq(businesses.ownerId, ownerId),
  })
  return ownedBusinesses ? ownedBusinesses : []
}
export const getAllLocations = async () => {
  const ownedBusinesses = await db.query.businesses.findMany()
  return ownedBusinesses ? ownedBusinesses : []
}