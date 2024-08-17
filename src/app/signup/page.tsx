import { auth } from '@/auth/auth'
import SecondaryLink from '@/components/secondaryLinks'
import { SignUpForm } from '@/components/signUpForm'
import Submit from '@/components/submitBtn'
import { signupSchema } from '@/utils/validators'
import type { SignUpData } from '@/utils/validators'
import { Input } from '@nextui-org/input'
import { redirect } from 'next/navigation'

const signup = async () => {
  const session = await auth()
  if (session && session?.user) {
    redirect('/dashboard')
  }

  return (
    <section className="flex flex-col rounded-md mx-auto px-4 py-8 gap-8">
      <h1 className="uppercase text-2xl font-bold"> Create Account </h1>
      <SignUpForm />

      <SecondaryLink text="Already have an account? Login" href="/signin" />
    </section>
  )
}
export default signup
