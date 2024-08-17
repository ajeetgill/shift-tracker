'use server'
import { signIn } from '@/auth/auth'
import { signupSchema } from '@/utils/validators'
import { AuthError } from 'next-auth'
import type { ZodError } from 'zod'

export const handleSignUp = async (formData: unknown) => {
  try {
    const newUserData = signupSchema.safeParse(formData)

    if (!newUserData.success) {
      const error: ZodError = newUserData.error
      const allErrors = error.issues.map((item) => {
        return item.message
      })
      return {
        error: allErrors,
      }
    } else {
      const authUserObj = {
        ...newUserData.data,
        authActionPath: 'signup',
      }
      await signIn('credentials', authUserObj)
      console.log('🧃server - newUserData', newUserData)
      console.log(newUserData.data)
      delete newUserData.data.password
      return {
        message: newUserData?.data,
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          console.error('err:: /singin - could not authenticated')
          return { error: 'err:: Invalid credentials!' }
        }
      }
    }
    throw error
  }
}
export const handleLogin = async (formData: FormData) => {
  try {
    formData.set('authActionPath', 'signin')
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          console.error('err:: /singin - could not authenticated')
          return { error: 'err:: Invalid credentials!' }
        }
      }
    }
    throw error
  }
}
