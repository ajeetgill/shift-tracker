import { auth } from '@/auth/auth'
import SecondaryLink from '@/components/secondaryLinks'
import SigninForm from '@/components/singInForm'
import { USER_ROLES } from '@/utils/constants'
import { redirect } from 'next/navigation'

const login = async () => {
  const session = await auth()

  if (session?.user) {
    if (session.user.role?.toLowerCase() === USER_ROLES.WORKER)
      redirect('/dashboard')
    else if (session.user.role?.toLowerCase() === USER_ROLES.OWNER)
      redirect('/')
  }

  return (
    <section className="flex flex-col rounded-md mx-auto px-4 py-8 gap-8">
      <SigninForm />
      <SecondaryLink text="Need an account? Signup" href="/signup" />
    </section>
  )
}
export default login
