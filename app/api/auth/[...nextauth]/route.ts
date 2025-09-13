import { prisma } from "@/prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const userExist = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (userExist) return true

      const hasInvitation = await prisma.invitation.findUnique({
        where: { email: user.email! },
      })

      if (hasInvitation) return true

      return false
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

/**
 *
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if the user exists in your database
      const existingUser = await findUserInDatabase(user.email)
      if (existingUser) {
        // User exists, allow sign in
        return true
      } else {
        // User doesn't exist, deny sign in
        return false
        // Alternatively, you could create the user here if you want to allow new signups
      }
    },
  },
})
 */
