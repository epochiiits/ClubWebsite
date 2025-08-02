import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { AuthWrapper } from "@/components/auth-wrapper"

async function getEvents() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch events")
    return await response.json()
  } catch (error) {
    return []
  }
}

export const metadata = {
  title: "Events - Epoch",
  description: "Join our upcoming tech events, workshops, and networking sessions",
}

export default async function EventsPage() {
  const events = await getEvents()

  const upcomingEvents = events.filter((event: any) => new Date(event.date) >= new Date())
  const pastEvents = events.filter((event: any) => new Date(event.date) < new Date())

  return (
    <AuthWrapper>
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join our community events, workshops, and networking sessions. Learn new skills and connect with fellow tech
          enthusiasts.
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event: any) => (
              <Card key={event._id} className="flex flex-col">
                {event.image && (
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{new Date(event.date).toLocaleDateString()}</Badge>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.venue}
                    </div>
                    {event.maxAttendees && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        Max {event.maxAttendees} attendees
                      </div>
                    )}
                  </div>
                  <Button asChild>
                    <Link href={`/events/${event._id}`}>View Details & RSVP</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming events scheduled.</p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.slice(0, 6).map((event: any) => (
              <Card key={event._id} className="opacity-75">
                {event.image && (
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{new Date(event.date).toLocaleDateString()}</Badge>
                    <Badge variant="outline">Past</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.venue}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
    </AuthWrapper>
  )
}
