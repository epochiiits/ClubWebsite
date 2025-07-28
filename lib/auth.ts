import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "./mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // "signin" or "signup"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        await connectDB()

        if (credentials.action === "signup") {
          // Check if user already exists
          const existingUser = await User.findOne({ email: credentials.email })
          if (existingUser) {
            throw new Error("User already exists with this email")
          }

          // Create new user
          const hashedPassword = await bcrypt.hash(credentials.password, 12)
          const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
          const isAdmin = adminEmails.includes(credentials.email)

          const user = await User.create({
            email: credentials.email,
            name: credentials.email.split("@")[0], // Default name from email
            password: hashedPassword,
            role: isAdmin ? "admin" : "user",
            provider: "credentials",
            providerId: credentials.email,
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.role === "admin",
          }
        } else {
          // Sign in existing user
          const user = await User.findOne({ email: credentials.email })
          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.role === "admin",
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB()

          const existingUser = await User.findOne({ email: user.email })

          if (existingUser) {
            // Update existing user info
            existingUser.name = user.name || existingUser.name
            existingUser.image = user.image || existingUser.image
            await existingUser.save()

            // Update user object for session
            user.id = existingUser._id.toString()
            user.role = existingUser.role
            user.isAdmin = existingUser.role === "admin"
          } else {
            // Create new user
            const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
            const isAdmin = adminEmails.includes(user.email!)

            const newUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              role: isAdmin ? "admin" : "user",
              provider: "google",
              providerId: account.providerAccountId,
            })

            user.id = newUser._id.toString()
            user.role = newUser.role
            user.isAdmin = newUser.role === "admin"
          }
          return true
        } catch (error) {
          console.error("Google sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}
