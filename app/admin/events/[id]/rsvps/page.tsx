"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Users, UserCheck, UserX, Clock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EventRSVPsPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<any>(null)
  const [rsvps, setRSVPs] = useState([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>("")

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
      fetchEventAndRSVPs(resolvedParams.id)
    }
    getParams()
  }, [params])

  const fetchEventAndRSVPs = async (id: string) => {
    try {
      const [eventResponse, rsvpResponse] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch(`/api/admin/events/${id}/rsvps`),
      ])

      if (eventResponse.ok) {
        const eventData = await eventResponse.json()
        setEvent(eventData)
      }

      if (rsvpResponse.ok) {
        const rsvpData = await rsvpResponse.json()
        setRSVPs(rsvpData)
      }
    } catch (error) {
      toast.error("Failed to fetch event data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attending":
        return <Badge className="bg-green-100 text-green-800">Attending</Badge>
      case "not_attending":
        return <Badge className="bg-red-100 text-red-800">Not Attending</Badge>
      case "maybe":
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStats = () => {
    const attending = rsvps.filter((rsvp: any) => rsvp.status === "attending").length
    const notAttending = rsvps.filter((rsvp: any) => rsvp.status === "not_attending").length
    const maybe = rsvps.filter((rsvp: any) => rsvp.status === "maybe").length

    return { attending, notAttending, maybe, total: rsvps.length }
  }

  const exportRSVPs = () => {
    const csvContent = [
      ["Name", "Email", "Status", "RSVP Date"].join(","),
      ...rsvps.map((rsvp: any) =>
        [rsvp.user.name, rsvp.user.email, rsvp.status, new Date(rsvp.createdAt).toLocaleDateString()].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event?.title || "event"}-rsvps.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Event RSVPs</h1>
            <p className="text-muted-foreground">{event?.title}</p>
          </div>
          <Button onClick={exportRSVPs} disabled={rsvps.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total RSVPs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.attending}</p>
              <p className="text-sm text-muted-foreground">Attending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserX className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.notAttending}</p>
              <p className="text-sm text-muted-foreground">Not Attending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.maybe}</p>
              <p className="text-sm text-muted-foreground">Maybe</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RSVP List</CardTitle>
          <CardDescription>All RSVPs for this event</CardDescription>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No RSVPs yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RSVP Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp: any) => (
                  <TableRow key={rsvp._id}>
                    <TableCell className="font-medium">{rsvp.user.name}</TableCell>
                    <TableCell>{rsvp.user.email}</TableCell>
                    <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                    <TableCell>{new Date(rsvp.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
