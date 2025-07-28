import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const users = await User.find({}).select("name email role createdAt lastLogin").sort({ createdAt: -1 })

    // Calculate stats
    const stats = {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      members: users.filter((user) => user.role === "member").length,
      activeThisMonth: users.filter((user) => {
        if (!user.lastLogin) return false
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        return new Date(user.lastLogin) > lastMonth
      }).length,
    }

    return NextResponse.json({ users, stats })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
