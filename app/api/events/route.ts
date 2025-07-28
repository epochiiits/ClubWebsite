import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"
import User from "@/models/User"
import { eventSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get("upcoming")

    let filter = {}
    if (upcoming === "true") {
      filter = { date: { $gte: new Date() } }
    }

    const events = await Event.find(filter).populate("createdBy", "name email").sort({ date: 1 })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const event = await Event.create({
      ...validatedData,
      date: new Date(validatedData.date),
      rsvpDeadline: validatedData.rsvpDeadline ? new Date(validatedData.rsvpDeadline) : undefined,
      createdBy: user._id,
    })

    const populatedEvent = await Event.findById(event._id).populate("createdBy", "name email")

    return NextResponse.json(populatedEvent, { status: 201 })
  } catch (error) {
    console.error("Event creation error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
