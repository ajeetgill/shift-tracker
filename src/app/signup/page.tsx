import { auth } from '@/auth/auth'
import SecondaryLink from '@/components/secondaryLinks'
import { SignUpForm } from '@/components/signUpForm'
import { USER_ROLES } from '@/utils/constants'
import { redirect } from 'next/navigation'

const signup = async () => {
  const session = await auth()
  if (session && session?.user) {
    if (session.user.role?.toLowerCase() === USER_ROLES.WORKER)
      redirect('/dashboard')
    else if (session.user.role?.toLowerCase() === USER_ROLES.OWNER)
      redirect('/businesses')
  }

  return (
    <section className="flex flex-col rounded-md mx-auto px-4 py-8 gap-8">
      <h1 className="uppercase text-2xl font-bold text-center">
        {' '}
        Create Account{' '}
      </h1>
      <SignUpForm />
      <SecondaryLink text="Already have an account? Login" href="/signin" />
    </section>
  )
}
export default signup
