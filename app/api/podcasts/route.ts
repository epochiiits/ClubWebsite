import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Podcast from "@/models/Podcast"
import User from "@/models/User"
import { podcastSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { extractYouTubeId } from "@/lib/utils"

export async function GET() {
  try {
    await connectDB()

    const podcasts = await Podcast.find().populate("createdBy", "name email").sort({ publishedAt: -1 })

    return NextResponse.json(podcasts)
  } catch (error) {
    console.error("Podcasts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = podcastSchema.parse(body)

    const youtubeId = extractYouTubeId(validatedData.youtubeUrl)
    if (!youtubeId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const podcast = await Podcast.create({
      ...validatedData,
      youtubeId,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      createdBy: user._id,
    })

    const populatedPodcast = await Podcast.findById(podcast._id).populate("createdBy", "name email")

    return NextResponse.json(populatedPodcast, { status: 201 })
  } catch (error) {
    console.error("Podcast creation error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create podcast" }, { status: 500 })
  }
}
