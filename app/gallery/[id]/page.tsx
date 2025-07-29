import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryImage from "@/components/GalleryImage";
async function getGallery(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/gallery/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch gallery");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const gallery = await getGallery(id);

  if (!gallery) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{gallery.eventName}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(gallery.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Images className="h-4 w-4" />
                  <span>{gallery.images?.length || 0} photos</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              Event Gallery
            </Badge>
          </div>
        </div>

        {/* Description */}
        {gallery.description && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed">{gallery.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Image Gallery */}
        {gallery.images && gallery.images.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Event Photos</h2>
              <p className="text-muted-foreground">
                Browse through {gallery.images.length} photos from this event
              </p>
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {gallery.images.map((image: any, index: number) => (
                <div key={index} className="break-inside-avoid">
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                    <GalleryImage
                      src={
                        image.url ||
                        "/placeholder.svg?height=300&width=400&text=Image"
                      }
                      alt={image.caption || `Event photo ${index + 1}`}
                      aspect="aspect-[4/3]"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    {image.caption && (
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {image.caption}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ))}
            </div>

            {/* Gallery Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {gallery.images.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Photos
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {new Date(gallery.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Event Date
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {new Date(gallery.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gallery Created
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Images className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No photos available
              </h3>
              <p className="text-muted-foreground">
                This gallery doesn't have any photos yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
