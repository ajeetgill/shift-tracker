import { signOut } from '@/auth/auth'
import Submit from './submitBtn'

const SignOutBtn = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
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
