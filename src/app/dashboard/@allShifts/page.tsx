import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import { getAllShifts } from '@/db/dbTools'
import { Chip } from '@nextui-org/chip'
import DisplayShifts from '@/components/displayShifts'
import { Suspense } from 'react'

const ShiftsPage = async () => {
  const session = await auth()
  if (!session) redirect('/signin')

  const employee = session.user
  const employeeName = employee?.name
  const allShifts = await getAllShifts(employee.id)
  // console.log('📒 Allshifts ', allShifts)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">All Shifts ({allShifts.length}):</h2>
      <section className="flex flex-col gap-4 my-2">
        {allShifts.length < 1 ? (
          <div>
            <p>No shifts to show</p>
          </div>
        ) : (
          <DisplayShifts allShifts={allShifts.reverse()} />
        )}
      </section>
    </div>
  )
}
export default ShiftsPage
