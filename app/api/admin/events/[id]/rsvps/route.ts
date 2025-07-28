import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import RSVP from "@/models/RSVP"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const rsvps = await RSVP.find({ event: params.id })
      .populate("user", "name email image")
      .populate("event", "title date venue")
      .sort({ createdAt: -1 })

    const stats = {
      attending: rsvps.filter((r) => r.status === "attending").length,
      notAttending: rsvps.filter((r) => r.status === "not_attending").length,
      maybe: rsvps.filter((r) => r.status === "maybe").length,
      total: rsvps.length,
    }

    return NextResponse.json({
      rsvps,
      stats,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event RSVPs" }, { status: 500 })
  }
}
