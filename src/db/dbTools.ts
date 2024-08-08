import { User } from 'next-auth'
import { db } from './db'
import { shifts, users } from './schema'
import { eq, sql } from 'drizzle-orm'
import { hashPW } from '@/auth/authTools'

interface UserAuthData extends User {
  name: string
  phoneNumber: string
  password: string
}

export const getUserFromDB = async (userData: UserAuthData) => {
  // console.log('DB:: finding user...')
  const match = await db.query.users.findFirst({
    where: eq(users.phoneNumber, userData.phoneNumber),
  })
  // if (!match) throw new Error(`No user found with ph:${phNum}`)
  if (!match) {
    // console.log(`DB:: user found`)
    return null
  }
  // console.log(`DB:: user found`)
  return match
}
export const createUser = async (userData: UserAuthData) => {
  const hashedPassword = await hashPW(userData.password)

  const createdUsers = await db
    .insert(users)
    .values({ ...userData, password: hashedPassword })
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
  gpsShiftLocation: string
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
        businessId: shiftData.employeeId,
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

export const getAllShifts = async (employeeId) => {
  const allShifts = await db.query.shifts.findMany({
    where: eq(shifts.employeeId, employeeId),
  })
  return allShifts ? allShifts : []
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
