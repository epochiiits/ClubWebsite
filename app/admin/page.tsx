"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, ImageIcon, Mic, FolderOpen } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: "Manage Blogs",
      description: "Create and edit blog posts",
      href: "/admin/blogs",
      icon: FileText,
      stats: stats?.blogs,
    },
    {
      title: "Manage Projects",
      description: "Add and update projects",
      href: "/admin/projects",
      icon: FolderOpen,
      stats: stats?.projects,
    },
    {
      title: "Manage Events",
      description: "Create events and view RSVPs",
      href: "/admin/events",
      icon: Calendar,
      stats: stats?.events,
    },
    {
      title: "Manage Gallery",
      description: "Upload event photos",
      href: "/admin/gallery",
      icon: ImageIcon,
      stats: stats?.galleries,
    },
    {
      title: "Manage Podcasts",
      description: "Add YouTube videos",
      href: "/admin/podcasts",
      icon: Mic,
      stats: stats?.podcasts,
    },
    {
      title: "View Users",
      description: "Manage user accounts",
      href: "/admin/users",
      icon: Users,
      stats: stats?.users,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your club's content and monitor activity</p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blogs.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.blogs.published} published, {stats.blogs.draft} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events.total}</div>
              <p className="text-xs text-muted-foreground">{stats.events.upcoming} upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rsvps.total}</div>
              <p className="text-xs text-muted-foreground">Total attending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects.total}</div>
              <p className="text-xs text-muted-foreground">Community projects</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.href} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <action.icon className="h-8 w-8 text-primary" />
                {action.stats && <Badge variant="secondary">{action.stats.total || 0}</Badge>}
              </div>
              <CardTitle>{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={action.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
