"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyRSVPsPage() {
  const { data: session, status } = useSession();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchRsvps();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchRsvps = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (response.ok) {
        const data = await response.json();
        // Filter out RSVPs where event is null (deleted events)
        const validRsvps = data.filter((rsvp: any) => rsvp.event);
        setRsvps(validRsvps);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to load RSVPs");
      }
    } catch (error) {
      console.error("RSVP fetch error:", error);
      toast.error("Failed to load RSVPs");
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async (rsvpId: string, ticketId: string) => {
    try {
      const response = await fetch(`/api/rsvp/${rsvpId}/ticket`);
      if (!response.ok) throw new Error("Failed to download ticket");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticketId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Failed to download ticket");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">My RSVPs</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your RSVPs
          </p>
          <Button asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My RSVPs</h1>
        <p className="text-muted-foreground">
          Manage your event RSVPs and download tickets
        </p>
      </div>

      {rsvps.length > 0 ? (
        <div className="space-y-4">
          {rsvps.map((rsvp: any) => {
            // Safety check - skip RSVPs with missing event data
            if (!rsvp.event) {
              return null;
            }

            return (
              <Card key={rsvp._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{rsvp.event.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="default">Attending</Badge>
                      <Badge variant="outline">
                        {new Date(rsvp.event.date) >= new Date()
                          ? "Upcoming"
                          : "Past"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(rsvp.event.date).toLocaleDateString()} at{" "}
                        {new Date(rsvp.event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {rsvp.event.venue}
                      </div>
                      {rsvp.ticketId && (
                        <p className="text-xs text-muted-foreground">
                          Ticket ID: {rsvp.ticketId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${rsvp.event._id}`}>
                          View Event
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadTicket(rsvp._id, rsvp.ticketId)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Ticket
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven't RSVP'd to any events yet.
          </p>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
