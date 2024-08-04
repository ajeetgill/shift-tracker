import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db/db'
import { accounts, users } from '@/db/schema'
import { getUserFromDB, signUpUser } from '@/db/dbTools'
import { authValidationSchema, comparePW } from './authTools'

const authDBSchema = {
  usersTable: users,
  accountsTable: accounts,
}

export const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db, authDBSchema),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        name: { label: 'Name' },
        phone: { label: 'Phone Number' },
        password: { label: 'Password', type: 'password' },
        authActionPath: { label: 'Auth Action', type: 'text' },
      },
      authorize: async (credentials) => {
        const currentPath = '/' + credentials?.authActionPath!

        if (!credentials) throw new Error('Missing credentials.')

        let userData = undefined
        try {
          // signin doesn't require name
          const name = credentials.name ? credentials.name : 'login-request'
          userData = authValidationSchema.parse({
            name,
            phoneNumber: credentials.phone,
            password: credentials.password,
          })
          // console.log('Auth:: Credentials are valid🤌.')
        } catch (e) {
          console.error('Invalid Credentials')
          console.error(e)
        }
        if (currentPath === '/signin') {
          try {
            // try to find the user - if doesn't exist - exit
            // if exist - if correct password then return user
            const matchedUser = await getUserFromDB(userData!)

            if (!matchedUser) throw new Error('invalid user')
            const correctPW = await comparePW(
              userData?.password!,
              matchedUser?.password!,
            )

            if (!correctPW) {
              throw new Error('invalid user')
            }
            // console.log('Auth:: Found a match correctPW :: ', correctPW)
            return matchedUser
          } catch (userNotExistError) {
            // console.error(accountCreationError)
            console.error('Auth:: 🔴 /signin user-ph: ', userData?.phoneNumber)
          }
        } else if (currentPath === '/signup') {
          try {
            const newCreatedUser = await signUpUser(userData!)
            // userData! --> ! coz  I've parsed the data with zod'
            // console.log('Auth:: 🆕 new user created', newCreatedUser)

            return newCreatedUser
          } catch (accountCreationError) {
            console.error(
              'Auth:: 🔴 /signup Could not create account with phone number: ',
              userData?.phoneNumber,
            )
          }
        }
      },
    }),
  ],
}
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
