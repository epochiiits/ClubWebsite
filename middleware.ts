import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/api/admin")

    if (isAdminRoute && token?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/api/admin")

        if (isAdminRoute) {
          return token?.role === "admin"
        }

        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/api/admin/:path*", "/api/rsvp/:path*"],
}
