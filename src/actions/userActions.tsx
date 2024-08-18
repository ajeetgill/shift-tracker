'use server'
import { signIn } from '@/auth/auth'
import { signinSchema, signupSchema } from '@/utils/validators'
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
      delete newUserData.data.password
      return {
        message: newUserData?.data,
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          console.error('DEV::err: 🔴/singin - could not authenticated')
          return { error: 'Invalid credentials!' }
        }
      }
    }
    throw error
  }
}
export const handleLogin = async (formData: unknown) => {
  try {
    const newUserData = signinSchema.safeParse(formData)

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
        authActionPath: 'signin',
      }
      const authenticatedUser = await signIn('credentials', authUserObj)
      return {
        message: authenticatedUser,
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          console.error('DEV::err: 🔴/singin - could not authenticated')
          return { error: 'Invalid credentials!' }
        }
      }
    }
    throw error
  }
}
