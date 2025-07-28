declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      isAdmin?: boolean
    }
  }

  interface User {
    id: string
    role?: string
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    isAdmin?: boolean
  }
}
