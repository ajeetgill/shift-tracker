import { signOut } from '@/auth/auth'
import Submit from './submitBtn'
import { redirect } from 'next/navigation'

const SignOutBtn = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({
          redirectTo: '/signin',
        })
      }}
    >
      <Submit
        label="Sign Out"
        className="bg-red-400 hover:bg-red-500 font-semibold w-full max-w-[550px]"
      />
    </form>
  )
}

export default SignOutBtn
