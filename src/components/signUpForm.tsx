'use client'

import { Input } from '@nextui-org/react'
import { toast } from 'react-hot-toast'
import Submit from './submitBtn'
import { signupSchema } from '@/utils/validators'
import { ZodError } from 'zod'
import { PHONE_NUM_LENGTH } from '@/utils/constants'
import { handleSignUp } from '@/actions/userActions'

export const SignUpForm = () => {
  const initState = { message: null }

  const handleSubmit = async (formData: FormData) => {
    const newUserData = signupSchema.safeParse({
      name: formData.get('name'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
    })
    if (!newUserData.success) {
      console.error('🛑 Validation failed.')
      const error: ZodError = newUserData.error
      const errMsg: string = error.issues[0].message

      error.issues.map((err) => {
        toast.error(`${err.message}`)
      })
    } else {
      try {
        const res = await handleSignUp(newUserData.data)
        if (res?.error) {
          if (Array.isArray(res?.error)) {
            res?.error.map((err) => {
              toast.error(err)
            })
          } else toast.error(res.error)
        } else {
          const okMsg: string = '🎉Yayy. Setting account...'
          toast.success(okMsg)
          console.log(res?.message ?? 'N/A RESPONSE')
        }
      } catch (e) {
        toast.error(`Something went wrong`)
      }
    }
  }

  return (
    <form
      className="flex w-full flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]"
      action={handleSubmit}
    >
      <Input
        name="name"
        type="text"
        required
        label="Name"
        placeholder="Your name"
        className="max-w-md"
      />
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
        label="Choose Password"
        placeholder="Length 3-16 characters"
        className="max-w-md"
      />
      <Submit className="w-full max-w-md mt-4 mb-2" label="Signup" />
    </form>
  )
}
