import NextAuth, { DefaultSession, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db/db'
import { accounts, users } from '@/db/schema'
import { createUser, getExistingUser } from '@/db/dbTools'
import { signinSchema, userAuthSchema } from '@/utils/validators'
import { comparePW } from './authUtils'

declare module 'next-auth' {
  interface User {
    phoneNumber?: string
    role?: string
  }

  interface Session {
    user: {
      phoneNumber?: string
      role?: string
    } & DefaultSession['user']
  }
}

const authDBSchema = {
  usersTable: users,
  accountsTable: accounts,
}

export const authOptions: NextAuthConfig = {
  trustHost: true,
  adapter: DrizzleAdapter(db, authDBSchema),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        name: { label: 'Name', type: 'text' },
        phoneNumber: { label: 'Phone Number' },
        password: { label: 'Password', type: 'password' },
        authActionPath: { label: 'Auth Action', type: 'text' },
      },
      authorize: async (credentials) => {
        // @!📖READ
        // At this point the credentials are validated inside the handleSignUp
        // (but in order to use them without type issues - I still need to parse them
        // OR properly define the credentials key-value types)

        const currentPath = '/' + credentials?.authActionPath!

        if (!credentials) throw new Error('Missing credentials.')

        if (currentPath === '/signin') {
          const userLoginDetails = signinSchema.safeParse({
            ...credentials,
            phoneNumber: credentials?.phoneNumber,
          })
          try {
            // find the user - if
            // -does not exist => exit/return/catch
            // -exist => if correct password then return user
            const existingUser = await getExistingUser(
              userLoginDetails.data.phoneNumber!,
            )
            if (!existingUser) throw new Error('DEV:Invalid user')

            const correctPW = await comparePW(
              userLoginDetails.data?.password!,
              existingUser?.password!,
            )
            if (!correctPW) {
              throw new Error('DEV:Invalid user')
            } else {
              delete existingUser?.password
            }
            return existingUser
          } catch (userNotExistError) {
            // console.error(userNotExistError)
            console.error(
              'DEV::Auth: 🔴/signin user phone = ',
              userLoginDetails?.data.phoneNumber,
            )
          }
        } else if (currentPath === '/signup') {
          const userCreationDetails = userAuthSchema.safeParse({
            ...credentials,
            phoneNumber: Number(credentials?.phoneNumber),
          })
          try {
            const newCreatedUser = await createUser(userCreationDetails.data)
            return newCreatedUser
          } catch (accountCreationError) {
            // Unsure about how to best handle errors? Log them? or naah?
            // console.error('🔴/could not signup userData,')
            // console.error(userCreationDetails.error)
            // console.error(userCreationDetails.data)
            console.error(
              'DEV::🔴 Could not create account with phone number: ',
              userCreationDetails.data?.phoneNumber,
            )
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phoneNumber = user.phoneNumber
        token.role = user.role?.toLowerCase()
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token?.sub // read about subject identifier in readme
        session.user.phoneNumber = token.phoneNumber as string
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
}
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
