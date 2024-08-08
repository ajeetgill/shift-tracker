// install 'server-only' before using, had uninstalled previous one to cleanup before commiting code
// import 'server-only'
import bcrypt from 'bcrypt'
import { signIn } from './auth'
import { AuthError } from 'next-auth'
import { object, string } from 'zod'

const SALT_ROUNDS = Number(process.env.AUTH_SALT_ROUNDS!)
if (!SALT_ROUNDS) {
  throw new Error('Environment variable missing `SALT_ROUNDS`')
}
export const hashPW = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}
export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW)
}

export const handleLogin = async (formData: FormData) => {
  'use server'
  try {
    formData.set('authActionPath', 'signin')
    await signIn('credentials', formData)
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

export const handleSignUp = async (formData: FormData) => {
  'use server'
  try {
    formData.set('authActionPath', 'signup')
    await signIn('credentials', formData)
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

export const authValidationSchema = object({
  name: string({ required_error: 'Name is required' })
    .min(3, 'Name must be minimum 3 characters')
    .max(16, 'Name must be maximum 16 characters'),
  phoneNumber: string({ required_error: 'Phone Number is required' })
    .min(1, 'Phone Number is required')
    .max(12, 'Invalid Phone Number'),
  password: string({ required_error: 'Password is required' })
    .min(2, 'Password must be more than 8 characters')
    .max(16, 'Password must be less than 16 characters'),
})
