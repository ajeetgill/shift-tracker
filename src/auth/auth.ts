import NextAuth, { DefaultSession, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db/db'
import { accounts, users } from '@/db/schema'
import { createUser } from '@/db/dbTools'
import { userAuthSchema } from '@/utils/validators'

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
        // at this point the credentials are validated inside the handleSignUp
        // (but in order to use them without type issues - I still need to parse them
        // OR properly define the credentials key-value types)
        //
        const currentPath = '/' + credentials?.authActionPath!
        console.log('currentPath::', currentPath)

        if (!credentials) throw new Error('Missing credentials.')

        const userData = userAuthSchema.safeParse({
          ...credentials,
          phoneNumber: Number(credentials?.phoneNumber),
        })

        console.log('userData', credentials)
        if (currentPath === '/signin') {
          console.log('WIP-Zod validation for /signin')
          // try {
          // try to find the user - if doesn't exist - exit
          // if exist - if correct password then return user
          //   const matchedUser = await getUserFromDB(userData!)

          //   if (!matchedUser) throw new Error('invalid user')
          //   const correctPW = await comparePW(
          //     userData?.password!,
          //     matchedUser?.password!,
          //   )

          //   if (!correctPW) {
          //     throw new Error('invalid user')
          //   }
          //   // console.log('Auth:: Found a match correctPW :: ', correctPW)
          //   return matchedUser
          // } catch (userNotExistError) {
          //   // console.error(accountCreationError)
          //   console.error('Auth:: 🔴 /signin user-ph: ', userData?.phoneNumber)
          // }
        } else if (currentPath === '/signup') {
          try {
            const newCreatedUser = await createUser(userData.data)
            return newCreatedUser
          } catch (accountCreationError) {
            console.error('🔴/could not signup userData,')
            console.error(userData.error)
            console.error(userData.data)
            console.error(
              'Auth:: 🔴 /signup Could not create account with phone number: ',
              userData.data?.phoneNumber,
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
