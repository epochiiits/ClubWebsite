import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

async function getBlog(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs/slug/${slug}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch blog")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: `${blog.title} - TechClub`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article>
        <Card>
          {blog.featuredImage && (
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img
                src={blog.featuredImage || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {blog.author && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {blog.author.name}
                </div>
              )}

              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                {blog.readTime || "5"} min read
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight">{blog.title}</h1>

            {blog.excerpt && <p className="text-xl text-muted-foreground leading-relaxed">{blog.excerpt}</p>}

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none">
            <div
              className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </CardContent>
        </Card>

        {/* Author Bio */}
        {blog.author && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{blog.author.name}</h3>
                  <p className="text-muted-foreground">
                    {blog.author.bio || "Tech enthusiast and contributor to TechClub"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  )
}
