import { auth } from '@/auth/auth'
import DataTable from '@/components/dataTable'

import SecondaryLink from '@/components/secondaryLinks'
import { getShiftDetails } from '@/db/dbTools'
import { USER_ROLES } from '@/utils/constants'
import { redirect } from 'next/navigation'

const ShiftDetails = async () => {
  const session = await auth()
  if (!session || session.user.role === USER_ROLES.WORKER) redirect('/signin')

  const shiftDetails = await getShiftDetails()

  return (
    <section className="flex  w-full flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]">
      <h2>ShiftDetails</h2>
      {Object.keys(shiftDetails).map((date) => (
        <div key={date}>
          <h3 className="text-2xl font-bold w-full bg-gray-500 p-4 pb-8 rounded-md relative top-6">
            {date}
          </h3>
          <DataTable allData={shiftDetails[date]} />
        </div>
      ))}
    </section>
  )
}
export default ShiftDetails
