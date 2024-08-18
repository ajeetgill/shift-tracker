'use client'

import { Input } from '@nextui-org/react'
import { ZodError } from 'zod'
import { toast } from 'react-hot-toast'
import Submit from './submitBtn'
import { signinSchema } from '@/utils/validators'
import { PHONE_NUM_LENGTH } from '@/utils/constants'
import { handleLogin } from '@/actions/userActions'

const SigninForm = ({
  path = '/signin',
  btnText = 'Login',
  heading = 'Login Account',
}: {
  path?: string
  btnText?: string
  heading?: string
}) => {
  const getUserData = (formData: FormData) => {
    return signinSchema.safeParse({
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
    })
  }

  const handleSubmit = async (formData: FormData) => {
    const userData = getUserData(formData)

    if (!userData.success) {
      const error: ZodError = userData.error

      error.issues.map((err) => {
        toast.error(`${err.message}`)
      })
    } else {
      try {
        let res = undefined
        const t = signinSchema.safeParse({
          phoneNumber: formData.get('phoneNumber'),
          password: formData.get('password'),
        })
        res = await handleLogin(t.data)

        if (res?.error) {
          if (Array.isArray(res?.error)) {
            res?.error.map((err) => {
              toast.error(err)
            })
          } else toast.error(res.error)
        } else {
          const okMsg: string = res?.message ?? 'Welcome 👋'
          toast.success(okMsg)
        }
      } catch (e) {
        toast.error(`Something went wrong`)
      }
    }
  }

  return (
    <>
      <h1 className="uppercase text-2xl font-bold text-center">{heading}</h1>
      <form
        className="flex max-w-[550px] w-full flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]"
        action={handleSubmit}
      >
        <Input
          name="phoneNumber"
          type="tel"
          required
          maxLength={PHONE_NUM_LENGTH}
          label="Phone"
          placeholder="902XXX1234"
          className="max-w-md"
        />
        <Input
          name="password"
          type="text"
          required
          label="Password"
          placeholder="Length 3-16 characters"
          className="max-w-md"
        />
        <Submit className="w-full max-w-md mt-4 mb-2" label={btnText} />
      </form>
    </>
  )
}
export default SigninForm
