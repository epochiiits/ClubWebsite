import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import RSVP from "@/models/RSVP"
import User from "@/models/User"
import { generateTicketPDF } from "@/lib/ticket-generator"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { type Session } from "next-auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = (await getServerSession(authOptions)) as Session | null

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const rsvp = await RSVP.findById(id)
      .populate("event", "title date venue")
      .populate("user", "name email")

    if (!rsvp) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 })
    }

    // Check if user owns this RSVP or is admin
    if (rsvp.user.email !== session.user.email && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Generating ticket for RSVP:", {
      eventTitle: rsvp.event?.title,
      eventDate: rsvp.event?.date,
      eventVenue: rsvp.event?.venue,
      attendeeName: rsvp.user?.name,
      attendeeEmail: rsvp.user?.email,
      ticketId: rsvp.ticketId,
    })

    try {
      const pdfBuffer = await generateTicketPDF({
        eventTitle: rsvp.event.title,
        eventDate: new Date(rsvp.event.date),
        eventVenue: rsvp.event.venue,
        attendeeName: rsvp.user.name,
        attendeeEmail: rsvp.user.email,
        ticketId: rsvp.ticketId,
      })

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="ticket-${rsvp.ticketId}.pdf"`,
        },
      })
    } catch (pdfError) {
      console.error("Ticket generation error:", pdfError)
      return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 })
    }
  } catch (error) {
    console.error("Ticket route error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}