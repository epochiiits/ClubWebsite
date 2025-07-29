import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Blog from "@/models/Blog"
import Project from "@/models/Project"
import Event from "@/models/Event"
import RSVP from "@/models/RSVP"
import Gallery from "@/models/Gallery"
import Podcast from "@/models/Podcast"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()

    const [
      totalBlogs,
      publishedBlogs,
      totalProjects,
      totalEvents,
      upcomingEvents,
      totalRSVPs,
      totalGalleries,
      totalPodcasts,
      totalUsers,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      Project.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() } }),
      RSVP.countDocuments(), // Count all RSVPs since they're all attending now
      Gallery.countDocuments(),
      Podcast.countDocuments(),
      User.countDocuments(),
    ])

    const stats = {
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: totalBlogs - publishedBlogs,
      },
      projects: {
        total: totalProjects,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        past: totalEvents - upcomingEvents,
      },
      rsvps: {
        total: totalRSVPs,
      },
      galleries: {
        total: totalGalleries,
      },
      podcasts: {
        total: totalPodcasts,
      },
      users: {
        total: totalUsers,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
