import { auth } from '@/auth/auth'
import CreateShift from '@/components/createShift'
import SignOutBtn from '@/components/signOutButton'
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const session = await auth()
  if (!session) {
    redirect('/')
  }

  if (session && session?.user) {
    const employeeName = session.user?.name!
    // l -> L, turning luffy//{employeeName} into Luffy//{name}
    const name = employeeName[0].toUpperCase() + '' + employeeName.substring(1)

    return (
      <div className="flex flex-col justify-between min-h-[70vh]">
        <CreateShift />
        <SignOutBtn />
      </div>
    )
  }
}
export default Dashboard
