import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Podcast from "@/models/Podcast"
import User from "@/models/User"
import { podcastSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()

    const podcast = await Podcast.findById(id).populate("createdBy", "name email")

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
    }

    return NextResponse.json(podcast)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch podcast" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = podcastSchema.parse(body)

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const podcast = await Podcast.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        createdBy: user._id,
      },
      { new: true },
    ).populate("createdBy", "name email")

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
    }

    return NextResponse.json(podcast)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update podcast" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const podcast = await Podcast.findByIdAndDelete(id)

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Podcast deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 })
  }
}
