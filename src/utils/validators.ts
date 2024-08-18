import { z } from 'zod'
import {
  AUTH_JS_ACTION,
  NAME_LENGTH_MAX,
  NAME_LENGTH_MIN,
  PHONE_NUM_LENGTH,
} from './constants'

// START::- FIELD SCHEMAS (not same as objects)
export const NameSchema = z
  .string()
  .trim()
  .min(NAME_LENGTH_MIN, `Name must be minimum ${NAME_LENGTH_MIN} characters`)
  .max(NAME_LENGTH_MAX, `Name must be maximum ${NAME_LENGTH_MAX} characters`)

export const PhoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
  .length(PHONE_NUM_LENGTH, {
    message: `Phone Number Length: ${PHONE_NUM_LENGTH} digits`,
  })

// const PhoneNumberSchema = z.preprocess((val) => {
//   console.log('PhoneNumberSchema - val = ', val, typeof val)
//   if (typeof val === 'string') {
//     // Remove non-digit characters and convert to number
//     const cleanedPhone = val.replace(/\D/g, '')
//     return parseInt(cleanedPhone, 10)
//   }
//   return undefined
// }, z.number().int().positive('Phone number must be a positive integer'))

export const PasswordSchema = z
  .string()
  .trim()
  .min(3, 'Password must be minimum 3 characters')
  .max(16, 'Password must be maximum 16 characters')

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
  authReactActionPath: z.string().trim().length(6),
})
type AuthActionSignInData = z.infer<typeof userDataAuthAction>

// END::- ACTION? SCHEMAS

// START::-
// END::-
// the `AuthActionSignInData` add auth action used to differentiate b/w signin and signup

export { signupSchema, signinSchema, userAuthSchema }
export type { SignInData, AuthActionSignInData, SignUpData, UserAuthData }
