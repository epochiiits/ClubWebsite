"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { notFound, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [rsvp, setRsvp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [eventId, setEventId] = useState<string>("")

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (eventId) {
      fetchEvent()
      if (session) {
        fetchRsvp()
      }
    }
  }, [eventId, session])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error("Failed to fetch event")
      }
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      toast.error("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  const fetchRsvp = async () => {
    try {
      const response = await fetch("/api/rsvp")
      if (response.ok) {
        const rsvps = await response.json()
        const eventRsvp = rsvps.find((r: any) => r.event._id === eventId)
        setRsvp(eventRsvp)
      }
    } catch (error) {
      // Ignore error - user might not have any RSVPs
    }
  }

  const handleRsvp = async (status: "attending" | "not_attending" | "maybe") => {
    if (!session) {
      toast.error("Please sign in to RSVP")
      return
    }

    setRsvpLoading(true)
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          status,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to RSVP")
      }

      const newRsvp = await response.json()
      setRsvp(newRsvp)
      toast.success(`RSVP updated to ${status.replace("_", " ")}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to RSVP")
    } finally {
      setRsvpLoading(false)
    }
  }

  const downloadTicket = async () => {
    if (!rsvp || rsvp.status !== "attending") return

    try {
      const response = await fetch(`/api/rsvp/${rsvp._id}/ticket`)
      if (!response.ok) throw new Error("Failed to download ticket")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ticket-${rsvp.ticketId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Ticket downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download ticket")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const isUpcoming = new Date(event.date) >= new Date()
  const canRsvp = isUpcoming && (!event.rsvpDeadline || new Date() <= new Date(event.rsvpDeadline))

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            {event.image && (
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={isUpcoming ? "secondary" : "outline"}>{isUpcoming ? "Upcoming" : "Past Event"}</Badge>
                <Badge variant="outline">{new Date(event.date).toLocaleDateString()}</Badge>
              </div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              <CardDescription className="text-lg">{event.description}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground">{event.venue}</p>
                </div>
              </div>

              {event.maxAttendees && (
                <div className="flex items-center text-sm">
                  <Users className="mr-3 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-muted-foreground">{event.maxAttendees} attendees</p>
                  </div>
                </div>
              )}

              {event.rsvpDeadline && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">RSVP Deadline</p>
                    <p className="text-muted-foreground">{new Date(event.rsvpDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RSVP Section */}
          {session && canRsvp && (
            <Card>
              <CardHeader>
                <CardTitle>RSVP</CardTitle>
                <CardDescription>Let us know if you're planning to attend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleRsvp("attending")}
                  disabled={rsvpLoading}
                  variant={rsvp?.status === "attending" ? "default" : "outline"}
                  className="w-full"
                >
                  ✓ Attending
                </Button>
                <Button
                  onClick={() => handleRsvp("maybe")}
                  disabled={rsvpLoading}
                  variant={rsvp?.status === "maybe" ? "default" : "outline"}
                  className="w-full"
                >
                  ? Maybe
                </Button>
                <Button
                  onClick={() => handleRsvp("not_attending")}
                  disabled={rsvpLoading}
                  variant={rsvp?.status === "not_attending" ? "default" : "outline"}
                  className="w-full"
                >
                  ✗ Not Attending
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ticket Download */}
          {rsvp?.status === "attending" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Ticket</CardTitle>
                <CardDescription>Download your event ticket</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadTicket} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Ticket
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Ticket ID: {rsvp.ticketId}</p>
              </CardContent>
            </Card>
          )}

          {/* Sign in prompt */}
          {!session && canRsvp && (
            <Card>
              <CardHeader>
                <CardTitle>RSVP Required</CardTitle>
                <CardDescription>Sign in to RSVP for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/api/auth/signin">Sign In to RSVP</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
