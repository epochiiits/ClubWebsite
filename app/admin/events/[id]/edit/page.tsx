"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [eventId, setEventId] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    image: "",
    maxAttendees: "",
    rsvpDeadline: "",
  })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
      fetchEvent(resolvedParams.id)
    }
    getParams()
  }, [params])

  const fetchEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (response.ok) {
        const event = await response.json()
        const eventDate = new Date(event.date)
        const rsvpDate = event.rsvpDeadline ? new Date(event.rsvpDeadline) : null

        setFormData({
          title: event.title || "",
          description: event.description || "",
          date: eventDate.toISOString().slice(0, 16),
          venue: event.venue || "",
          image: event.image || "",
          maxAttendees: event.maxAttendees?.toString() || "",
          rsvpDeadline: rsvpDate ? rsvpDate.toISOString().slice(0, 16) : "",
        })
      } else {
        toast.error("Event not found")
        router.push("/admin/events")
      }
    } catch (error) {
      toast.error("Failed to fetch event")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.date || !formData.venue) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        rsvpDeadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : undefined,
        maxAttendees: formData.maxAttendees ? Number.parseInt(formData.maxAttendees) : undefined,
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast.success("Event updated successfully!")
        router.push("/admin/events")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update event")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-2">Edit Event</h1>
        <p className="text-muted-foreground">Update your event details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Update the details of your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Event venue"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    placeholder="Leave empty for unlimited"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rsvpDeadline">RSVP Deadline</Label>
                  <Input
                    id="rsvpDeadline"
                    type="datetime-local"
                    value={formData.rsvpDeadline}
                    onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Event Image"
                disabled={loading}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Event"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/events">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
