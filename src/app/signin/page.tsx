import { auth } from '@/auth/auth'
import { handleLogin } from '@/auth/authTools'
import SecondaryLink from '@/components/secondaryLinks'
import Submit from '@/components/submitBtn'
import { signinSchema } from '@/utils/validators'
import { Input } from '@nextui-org/input'
import { redirect } from 'next/navigation'

const login = async () => {
  const session = await auth()
  if (session && session?.user) {
    redirect('/dashboard')
  }

  return (
    <section className="flex flex-col rounded-md mx-auto px-4 py-8 gap-8">
      <h1 className="uppercase text-2xl font-bold"> Login Account </h1>

      <form
        className="flex max-w-[550px] w-full flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]"
        action={async (formData: FormData) => {
          'use server'
          const userData = signinSchema.parse({
            phoneNumber: formData.get('phone'),
            password: formData.get('password'),
          })
          console.log('Signin Data validated,', userData)
          // await handleLogin(userData)
        }}
      >
        <Input
          type="text"
          name="phone"
          label="Phone"
          required
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

        <Submit className="w-full max-w-md mt-4 mb-2" label="Login" />
      </form>
      <SecondaryLink text="Need an account? Signup" href="/signup" />
    </section>
  )
}
export default login
