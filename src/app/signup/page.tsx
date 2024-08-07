import { auth } from '@/auth/auth'
import { handleSignUp } from '@/auth/authTools'
import SecondaryLink from '@/components/secondaryLinks'
import Submit from '@/components/submitBtn'
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

      <form
        className="flex max-w-[550px] w-full flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]"
        action={async (formData: FormData) => {
          'use server'
          await handleSignUp(formData)
        }}
      >
        <Input
          type="text"
          name="name"
          required
          label="Name"
          placeholder="Your name"
          className="max-w-md"
        />
        <Input
          type="text"
          name="phone"
          required
          label="Phone"
          placeholder="902XXX1234"
          className="max-w-md"
        />
        <Input
          type="text"
          name="password"
          required
          label="Choose Password"
          placeholder="Length 3-16 characters"
          className="max-w-md"
        />

        <Submit className="w-full max-w-md mt-4 mb-2" label="Signup" />
      </form>
      <SecondaryLink text="Already have an account? Login" href="/signin" />
    </section>
  )
}
export default signup
