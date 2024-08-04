import { User } from 'next-auth'
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'
import { hashPW } from '@/auth/authTools'

interface UserAuthData extends User {
  name: string
  phoneNumber: string
  password: string
}

export const getUserFromDB = async (userData: UserAuthData) => {
  // console.log('DB:: finding user...')
  const match = await db.query.users.findFirst({
    where: eq(users.phoneNumber, userData.phoneNumber),
  })
  // if (!match) throw new Error(`No user found with ph:${phNum}`)
  if (!match) {
    // console.log(`DB:: user found`)
    return null
  }
  // console.log(`DB:: user found`)
  return match
}
export const signUpUser = async (userData: UserAuthData) => {
  const hashedPassword = await hashPW(userData.password)

  const createdUsers = await db
    .insert(users)
    .values({ ...userData, password: hashedPassword })
    .returning()
  // Unlike query - which gives back single user (my guess is coz the name of function is - findFirst)
  // and what I didn't know OR realize was that .insert().values()
  // values - being plural returns an array and not a single user
  // so extracting it out
  const createdUser = createdUsers[0]
  return createdUser
}
