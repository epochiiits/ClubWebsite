import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getPodcasts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/podcasts`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch podcasts")
    return await response.json()
  } catch (error) {
    return []
  }
}

export const metadata = {
  title: "Podcast - TechClub",
  description: "Watch our latest tech talks, interviews, and educational content",
}

export default async function PodcastPage() {
  const podcasts = await getPodcasts()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Podcast</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Watch our latest tech talks, interviews with industry experts, and educational content
        </p>
      </div>

      {podcasts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast: any) => (
            <Card key={podcast._id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{podcast.title}</CardTitle>
                {podcast.description && (
                  <CardDescription className="line-clamp-3">{podcast.description}</CardDescription>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(podcast.publishedAt).toLocaleDateString()}</span>
                  {podcast.duration && <Badge variant="outline">{podcast.duration}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${podcast.youtubeId}`}
                    title={podcast.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No podcast episodes available yet.</p>
        </div>
      )}
    </div>
  )
}
