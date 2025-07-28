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
import { ArrowLeft, X, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface GalleryImage {
  url: string
  caption: string
}

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [galleryId, setGalleryId] = useState<string>("")
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    description: "",
    images: [] as GalleryImage[],
  })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setGalleryId(resolvedParams.id)
      fetchGallery(resolvedParams.id)
    }
    getParams()
  }, [params])

  const fetchGallery = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`)
      if (response.ok) {
        const gallery = await response.json()
        const eventDate = new Date(gallery.eventDate)

        setFormData({
          eventName: gallery.eventName || "",
          eventDate: eventDate.toISOString().slice(0, 10),
          description: gallery.description || "",
          images: gallery.images || [],
        })
      } else {
        toast.error("Gallery not found")
        router.push("/admin/gallery")
      }
    } catch (error) {
      toast.error("Failed to fetch gallery")
    } finally {
      setInitialLoading(false)
    }
  }

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", caption: "" }],
    })
  }

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = { ...updatedImages[index], [field]: value }
    setFormData({ ...formData, images: updatedImages })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.eventName || !formData.eventDate || formData.images.length === 0) {
      toast.error("Please fill in all required fields and add at least one image")
      return
    }

    const validImages = formData.images.filter((img) => img.url.trim() !== "")
    if (validImages.length === 0) {
      toast.error("Please add at least one valid image")
      return
    }

    setLoading(true)
    try {
      const submitData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        images: validImages,
      }

      const response = await fetch(`/api/gallery/${galleryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast.success("Gallery updated successfully!")
        router.push("/admin/gallery")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update gallery")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update gallery")
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
          <Link href="/admin/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-2">Edit Gallery</h1>
        <p className="text-muted-foreground">Update your gallery details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Details</CardTitle>
              <CardDescription>Update the details of your gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="Enter event name"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the event"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Images *</CardTitle>
                  <CardDescription>Add images to your gallery</CardDescription>
                </div>
                <Button type="button" onClick={addImage} disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Image {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <ImageUpload
                    value={image.url}
                    onChange={(url) => updateImage(index, "url", url)}
                    label={`Image ${index + 1}`}
                    disabled={loading}
                  />

                  <div className="space-y-2">
                    <Label htmlFor={`caption-${index}`}>Caption</Label>
                    <Input
                      id={`caption-${index}`}
                      value={image.caption}
                      onChange={(e) => updateImage(index, "caption", e.target.value)}
                      placeholder="Enter image caption (optional)"
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}

              {formData.images.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No images added yet</p>
                  <Button type="button" onClick={addImage} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Gallery"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/gallery">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
