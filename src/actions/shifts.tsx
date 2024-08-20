'use server'

import { auth } from '@/auth/auth'
import { createShift, updateShiftAsEnded } from '@/db/dbTools'
import { revalidatePath } from 'next/cache'

export const clockInShift = async (prevState: any, formData: FormData) => {
  console.log('@action.shifts.employee.clockinshift')
  // console.log('🧖 starting time from client', formData)
  const session = await auth()
  if (!session) {
    console.log('DEV::🔴🧃 No session found')
    return
  }

  let employeeId = ''
  if (session && session?.user) {
    const employeeName = session.user?.name!
    employeeId = session.user?.id!
  }

  const businessId = formData.get('location').toString()
  const shiftNotes = formData.get('notes').toString()
  const temp_unixTimeMs = formData.get('shiftStartUnixTimeMS')
  const startUnixTimeSecs = Math.floor(Number(temp_unixTimeMs) / 1000) + ''

  const shiftData = {
    employeeId,
    businessId,
    startUnixTimeSecs,
    endTime: null,
    notes: shiftNotes,
  }
  // console.log('TODO:: about to create a shift, data =', shiftData)

  try {
    const createdShiftData = await createShift(shiftData)
    if (createdShiftData) revalidatePath('/dashboard/@allShifts')
    // console.log('🟢 :: created shift +1')
    // console.log('createdShiftData:', createdShiftData)
  } catch (err) {
    // console.error(err)
    console.error(
      "DEV::🐛Error::couldn't create shift - await createShift(shiftData)",
    )
  }
}
export const endActiveShift = async (endunixTimeMs) => {
  const session = await auth()
  if (!session) {
    console.log('DEV:: @actions/🔴/auth No session found')
    return
  }

  let employeeId = undefined
  if (session && session?.user) {
    employeeId = session.user?.id!
  }

  if (!employeeId) {
    console.log('DEV::🔴: NO EMPLOYEE TO END SHIFT FOR.')
    return
  }
  const updatedShift = await updateShiftAsEnded(employeeId, endunixTimeMs)
  if (updatedShift) revalidatePath('/dashboard')

  // setEmployeeWorkingAsInactive(employee)
}
