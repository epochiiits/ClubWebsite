"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPodcasts()
  }, [searchTerm])

  const fetchPodcasts = async () => {
    try {
      const response = await fetch("/api/podcasts")
      if (response.ok) {
        const data = await response.json()
        setPodcasts(data)
      }
    } catch (error) {
      toast.error("Failed to fetch podcasts")
    } finally {
      setLoading(false)
    }
  }

  const deletePodcast = async (id: string) => {
    try {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Podcast deleted successfully")
        fetchPodcasts()
      } else {
        throw new Error("Failed to delete podcast")
      }
    } catch (error) {
      toast.error("Failed to delete podcast")
    }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Podcasts</h1>
          <p className="text-muted-foreground">Add and manage podcast episodes</p>
        </div>
        <Button asChild>
          <Link href="/admin/podcasts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Podcast
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Podcast Episodes</CardTitle>
          <CardDescription>Manage all podcast episodes</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {podcasts.map((podcast: any) => (
                <TableRow key={podcast._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{podcast.title}</p>
                      {podcast.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{podcast.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(podcast.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{podcast.duration || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={podcast.youtubeUrl} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/podcasts/${podcast._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{podcast.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePodcast(podcast._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
