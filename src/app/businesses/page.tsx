import { auth } from '@/auth/auth'
import AddBusinessForm from '@/components/addBusinessForm'
import { USER_ROLES } from '@/utils/constants'
import { redirect } from 'next/navigation'

const BusinessesDashboard = async () => {
  const session = await auth()
  if (!session) redirect('/')
  if (session.user?.role !== USER_ROLES.OWNER) {
    redirect('/')
  }

  if (session && session?.user) {
    const userName = session.user?.name!
    // l -> L, turning luffy//{employeeName} into Luffy//{name}
    const name = userName[0].toUpperCase() + '' + userName.substring(1)

    return (
      <div className="flex flex-col justify-between mx-auto gap-8">
        <h1 className="font-bold text-2xl">Track Business Shifts</h1>
        <AddBusinessForm />
      </div>
    )
  }
}
export default BusinessesDashboard
