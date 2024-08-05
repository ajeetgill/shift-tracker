'use server'

export const clockInShift = async (prevState: any, formData: FormData) => {
  console.log('@action.shifts.employee.clockinshift')
  console.log('formData')
  const unixTimeMs = formData.get('shiftStartUnixTimeMS')
  const unixTime = Math.floor(Number(unixTimeMs) / 1000) + ''
  console.log(formData.get('name'), ' at unixtime:', unixTime)
}
// export const endActiveShift = async (employee) => {
//   if (!employee) return
//   const currentShift = employee?.currentShiftId
//   console.log('Employee: ', employee)
//   console.log('END ::: Employee ended shift', currentShift)

//   // setEmployeeWorkingAsInactive(employee)
// }
