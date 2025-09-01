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
import { AuthWrapper } from "@/components/auth-wrapper"

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

  // Helper function to convert UTC date to local display format
  const formatEventDateTime = (utcDateString: string) => {
    const utcDate = new Date(utcDateString)
    
    // Convert UTC to local time by removing the timezone offset
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
    
    return {
      date: localDate.toLocaleDateString(),
      time: localDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

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

  const handleRsvp = async () => {
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
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to RSVP")
      }

      const newRsvp = await response.json()
      setRsvp(newRsvp)
      toast.success("RSVP successful! You can now download your ticket.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to RSVP")
    } finally {
      setRsvpLoading(false)
    }
  }

  const downloadTicket = async () => {
    if (!rsvp) return

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
  
  // Format the event date and time for display
  const eventDateTime = formatEventDateTime(event.date)
  const rsvpDeadlineDateTime = event.rsvpDeadline ? formatEventDateTime(event.rsvpDeadline) : null

  return (
    <AuthWrapper>
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
                <Badge variant="outline">{eventDateTime.date}</Badge>
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
                  <p className="font-medium">{eventDateTime.date}</p>
                  <p className="text-muted-foreground">{eventDateTime.time}</p>
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

              {event.rsvpDeadline && rsvpDeadlineDateTime && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">RSVP Deadline</p>
                    <p className="text-muted-foreground">
                      {rsvpDeadlineDateTime.date} at {rsvpDeadlineDateTime.time}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RSVP/Ticket Section */}
          {session && canRsvp && (
            <Card>
              <CardHeader>
                <CardTitle>{rsvp ? "Your Ticket" : "RSVP"}</CardTitle>
                <CardDescription>
                  {rsvp ? "Download your event ticket" : "Reserve your spot for this event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rsvp ? (
                  <div className="space-y-3">
                    <Button onClick={downloadTicket} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Ticket
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Ticket ID: {rsvp.ticketId}
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleRsvp} disabled={rsvpLoading} className="w-full">
                    {rsvpLoading ? "Processing..." : "RSVP for Event"}
                  </Button>
                )}
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
    </AuthWrapper>
  )
}
