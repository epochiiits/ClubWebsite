import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import RSVP from "@/models/RSVP"
import Event from "@/models/Event"
import User from "@/models/User"
import { rsvpSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateTicketId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = rsvpSchema.parse(body)

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if event exists and is still accepting RSVPs
    const event = await Event.findById(validatedData.eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.rsvpDeadline && new Date() > event.rsvpDeadline) {
      return NextResponse.json({ error: "RSVP deadline has passed" }, { status: 400 })
    }

    // Check if user already RSVP'd
    const existingRSVP = await RSVP.findOne({
      event: validatedData.eventId,
      user: user._id,
    })

    if (existingRSVP) {
      return NextResponse.json({ error: "You have already RSVP'd for this event" }, { status: 400 })
    }

    // Check max attendees limit
    if (event.maxAttendees) {
      const currentRSVPCount = await RSVP.countDocuments({ event: validatedData.eventId })
      if (currentRSVPCount >= event.maxAttendees) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 })
      }
    }

    // Create new RSVP
    const rsvp = await RSVP.create({
      event: validatedData.eventId,
      user: user._id,
      ticketId: generateTicketId(),
    })

    const populatedRSVP = await RSVP.findById(rsvp._id)
      .populate("event", "title date venue")
      .populate("user", "name email")

    return NextResponse.json(populatedRSVP, { status: 201 })
  } catch (error) {
    console.error("RSVP creation error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create RSVP" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const rsvps = await RSVP.find({ user: user._id })
      .populate("event", "title date venue image")
      .sort({ createdAt: -1 })

    return NextResponse.json(rsvps)
  } catch (error) {
    console.error("RSVPs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}
