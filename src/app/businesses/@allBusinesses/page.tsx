import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import { getAllBusinesses } from '@/db/dbTools'
import DisplayShifts from '@/components/displayShifts'
import DisplayBusinesses from '@/components/displayBusinesses'

const BusinessesPage = async () => {
  const session = await auth()
  const userId = session?.user.id!
  let data = undefined
  try {
    data = await getAllBusinesses(userId)
  } catch (err) {
    // console.error(err)
    console.error('DEV::🔴/Could not getAllBusinesses list')
  }
  // console.log('🏢 Owned Businesses ', data)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        Tracked Businesses ({data.length ?? 0}):
      </h2>
      <section className="flex flex-col gap-4 my-2">
        {data.length < 1 ? (
          <div>
            <p>No data to show</p>
          </div>
        ) : (
          <DisplayBusinesses displayData={data} />
        )}
      </section>
    </div>
  )
}
export default BusinessesPage
