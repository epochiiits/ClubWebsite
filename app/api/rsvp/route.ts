import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import RSVP from "@/models/RSVP"
import Event from "@/models/Event"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateTicketId } from "@/lib/utils"
import { type Session } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { eventId } = body // Extract eventId, ignore other fields like status

    await connectDB()

    // Find the user to get the ObjectId
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if event exists and is still accepting RSVPs
    const event = await Event.findById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.rsvpDeadline && new Date() > event.rsvpDeadline) {
      return NextResponse.json({ error: "RSVP deadline has passed" }, { status: 400 })
    }

    // Check if user already RSVP'd
    const existingRSVP = await RSVP.findOne({
      event: eventId,
      user: user._id,
    })

    if (existingRSVP) {
      return NextResponse.json(existingRSVP)
    }

    // Check max attendees limit
    if (event.maxAttendees) {
      const currentRSVPCount = await RSVP.countDocuments({ event: eventId })
      if (currentRSVPCount >= event.maxAttendees) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 })
      }
    }

    // Create new RSVP
    const rsvp = await RSVP.create({
      event: eventId,
      user: user._id,
      ticketId: generateTicketId(),
    })

    const populatedRSVP = await RSVP.findById(rsvp._id)
      .populate("event", "title date venue")
      .populate("user", "name email")

    return NextResponse.json(populatedRSVP, { status: 201 })
  } catch (error) {
    console.error("RSVP creation error:", error)
    return NextResponse.json({ error: "Failed to create RSVP" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null

    if (!session?.user?.email) {
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

    // Filter out RSVPs where the event has been deleted
    const validRsvps = rsvps.filter(rsvp => rsvp.event !== null)

    return NextResponse.json(validRsvps)
  } catch (error) {
    console.error("RSVPs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}
