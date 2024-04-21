import NextAuth, { DefaultSession } from 'next-auth'

// type UserRole = 'user' | 'admin'
// type UserRole = string | null | undefined

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      // role: UserRole
    } & DefaultSession['user']
  }
  // interface User {
  //   role: UserRole
  // }
}
