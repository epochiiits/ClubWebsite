export const dynamic = 'force-dynamic'

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GalleryImage from "@/components/GalleryImage";
import { AuthWrapper } from "@/components/auth-wrapper";

async function getGalleries() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/gallery`);
    if (!response.ok) throw new Error("Failed to fetch galleries");
    return await response.json();
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const galleries = await getGalleries();

  return (
    <AuthWrapper>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl text-muted-foreground">
            Capturing moments from our community events
          </p>
        </div>

        {galleries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Images className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No galleries yet</h3>
              <p className="text-muted-foreground">
                Check back later for photos from our events!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery: any) => (
              <Link key={gallery._id} href={`/gallery/${gallery._id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {gallery.images && gallery.images.length > 0 ? (
                      <div className="relative">
                        <GalleryImage
                          src={
                            gallery.images[0].url ||
                            "/placeholder.svg?height=200&width=300&text=Event+Photo"
                          }
                          alt={gallery.eventName}
                        />
                        {gallery.images.length > 1 && (
                          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                            +{gallery.images.length - 1} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Images className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {gallery.eventName}
                    </h3>
                    {gallery.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {gallery.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Images className="h-4 w-4" />
                        <span>{gallery.images?.length || 0} photos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(gallery.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthWrapper>
  );
}
