import { signOut } from '@/auth/auth'
import Submit from './submitBtn'

const SignOutBtn = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
          .then(() => console.log('Signedout success.'))
          .finally(() => console.log('logOut :: jrny ended'))
      }}
    >
      <Submit label="Sign Out" color="danger" />
    </form>
  )
}

export default SignOutBtn
