import { z } from 'zod'
import { AUTH_JS_ACTION } from './constants'
import { users } from '@/db/schema'

// START::- FIELD SCHEMAS (not same as objects)
const NameSchema = z
  .string()
  .min(3, 'Name must be minimum 3 characters')
  .max(16, 'Name must be maximum 16 characters')

const PhoneNumberSchema = z.preprocess((val) => {
  console.log('PhoneNumberSchema - val = ', val, typeof val)
  if (typeof val === 'string') {
    // Remove non-digit characters and convert to number
    const cleanedPhone = val.replace(/\D/g, '')
    return parseInt(cleanedPhone, 10)
  }
  return undefined
}, z.number().int().positive('Phone number must be a positive integer'))

const PasswordSchema = z
  .string()
  .min(3, 'Name must be minimum 3 characters')
  .max(16, 'Name must be maximum 16 characters')

// END::- FIELD SCHEMAS (not same as objects)

// START::- ACTION? SCHEMAS
const signinSchema = z.object({
  phoneNumber: PhoneNumberSchema,
  password: PasswordSchema,
})
type SignInData = z.infer<typeof signinSchema>

const signupSchema = signinSchema.extend({
  name: NameSchema,
})
type SignUpData = z.infer<typeof signupSchema>

const userAuthSchema = signinSchema.extend({
  name: NameSchema,
  phoneNumber: z.number().transform((val) => val.toString()),
})
type UserAuthData = z.infer<typeof userAuthSchema>

// For now I'm not using ENUM coz type errors
// const userDataAuthAction = signupSchema.extend({
//   authReactActionPath: z.enum(AUTH_JS_ACTION),
// })
const userDataAuthAction = signupSchema.extend({
  authReactActionPath: z.string().length(6),
})
type AuthActionSignInData = z.infer<typeof userDataAuthAction>

// END::- ACTION? SCHEMAS

// START::-
// END::-
// the `AuthActionSignInData` add auth action used to differentiate b/w signin and signup

export { signupSchema, signinSchema }
export type { SignInData, AuthActionSignInData, SignUpData, UserAuthData }
