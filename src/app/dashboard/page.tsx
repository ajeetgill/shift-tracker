import { auth } from '@/auth/auth'
import CreateShift from '@/components/createShift'
import { getAllLocations, getEmployeeWorkStatus } from '@/db/dbTools'
import { USER_ROLES } from '@/utils/constants'
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const session = await auth()
  if (!session) {
    redirect('/')
  }
  if (session?.user.role.toLowerCase() === USER_ROLES.OWNER) {
    redirect('/employer')
  } else if (session && session?.user) {
    const userId = session?.user.id!
    const employeeName = session.user?.name!
    // l -> L, turning luffy//{employeeName} into Luffy//{name}
    const name = employeeName[0].toUpperCase() + '' + employeeName.substring(1)
    const employeeStatus = await getEmployeeWorkStatus(userId)
    const currentWorkStatus = employeeStatus.currentWorkStatus

    let allBusinesses = undefined
    try {
      allBusinesses = await getAllLocations()
    } catch (err) {
      console.error(err)
      console.error('Could not getAllBusinesses list')
    }
    return (
      <div className="flex flex-col justify-between max-w-[550px] mx-auto gap-8">
        <CreateShift
          name={name}
          currentWorkStatus={currentWorkStatus}
          shiftLocations={allBusinesses}
        />
      </div>
    )
  }
}
export default Dashboard
