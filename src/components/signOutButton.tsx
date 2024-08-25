import { auth, signOut } from '@/auth/auth'
import Submit from './submitBtn'
import { redirect } from 'next/navigation'

const SignOutBtn = async () => {
  const session = await auth()
  if (!session) return
  return (
    <form
      className="flex justify-center py-8"
      action={async () => {
        'use server'
        await signOut({
          redirectTo: '/signin',
        })
      }}
    >
      <Submit
        label="Sign Out"
        className="bg-red-400 hover:bg-red-500 font-semibold w-full "
      />
    </form>
  )
}

export default SignOutBtn
