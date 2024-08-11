import { auth } from '@/auth/auth'
import CreateShift from '@/components/createShift'
import { getEmployeeWorkStatus } from '@/db/dbTools'
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
    const employeeName = session.user?.name!
    // l -> L, turning luffy//{employeeName} into Luffy//{name}
    const name = employeeName[0].toUpperCase() + '' + employeeName.substring(1)
    const employeeStatus = await getEmployeeWorkStatus(session.user.id)
    const currentWorkStatus = employeeStatus.currentWorkStatus
    return (
      <div className="flex flex-col justify-between max-w-[550px] mx-auto gap-8">
        <CreateShift name={name} currentWorkStatus={currentWorkStatus} />
      </div>
    )
  }
}
export default Dashboard
