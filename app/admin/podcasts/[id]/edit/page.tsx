"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EditPodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [podcastId, setPodcastId] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    duration: "",
  })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setPodcastId(resolvedParams.id)
      fetchPodcast(resolvedParams.id)
    }
    getParams()
  }, [params])

  const fetchPodcast = async (id: string) => {
    try {
      const response = await fetch(`/api/podcasts/${id}`)
      if (response.ok) {
        const podcast = await response.json()
        setFormData({
          title: podcast.title || "",
          description: podcast.description || "",
          youtubeUrl: podcast.youtubeUrl || "",
          duration: podcast.duration || "",
        })
      } else {
        toast.error("Podcast not found")
        router.push("/admin/podcasts")
      }
    } catch (error) {
      toast.error("Failed to fetch podcast")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.youtubeUrl) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/podcasts/${podcastId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Podcast updated successfully!")
        router.push("/admin/podcasts")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update podcast")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update podcast")
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
          <Link href="/admin/podcasts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Podcasts
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-2">Edit Podcast</h1>
        <p className="text-muted-foreground">Update your podcast details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Podcast Details</CardTitle>
            <CardDescription>Update the details of your podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter podcast title"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your podcast"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL *</Label>
              <Input
                id="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 45 minutes"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Podcast"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/podcasts">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
