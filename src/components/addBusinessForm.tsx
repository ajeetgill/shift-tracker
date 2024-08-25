import { auth } from '@/auth/auth'
import { redirect } from 'next/navigation'
import MultipleInput from './multipleInput'

const AddBusinessForm = async () => {
  const session = await auth()
  if (!session) {
    redirect('/')
  }

  if (session && session?.user) {
    const userId = session.user?.id!
    // l -> L, turning luffy//{employeeName} into Luffy//{name}

    return (
      <div className="flex flex-col justify-between  w-full mx-auto gap-8 px-4">
        <div>
          <h1 className="font-bold text-lg">Add Business Form</h1>
          <small>*enter one business name per field</small>
        </div>

        <MultipleInput userId={userId} fieldsName="businessname" />
      </div>
    )
  }
}
export default AddBusinessForm
