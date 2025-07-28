import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

async function getBlogs(searchParams: Promise<{ page?: string; search?: string }>) {
  const resolvedParams = await searchParams
  const page = resolvedParams.page || "1"
  const search = resolvedParams.search || ""

  try {
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/blogs`)
    url.searchParams.set("published", "true")
    url.searchParams.set("page", page)
    url.searchParams.set("limit", "9")
    if (search) url.searchParams.set("search", search)

    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch blogs")

    return await response.json()
  } catch (error) {
    return { blogs: [], pagination: { page: 1, pages: 1, total: 0 } }
  }
}

export const metadata = {
  title: "Blog - TechClub",
  description: "Read our latest articles about technology, programming, and industry insights",
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { blogs, pagination } = await getBlogs(searchParams)
  const resolvedParams = await searchParams

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tutorials, and stories from our tech community
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            name="search"
            placeholder="Search articles..."
            className="pl-10"
            defaultValue={resolvedParams.search}
          />
          <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Blog Grid */}
      {blogs.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog: any) => (
              <Card key={blog._id} className="flex flex-col">
                {blog.featuredImage && (
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={blog.featuredImage || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-x-4 text-xs mb-2">
                    <time className="text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</time>
                    <div className="flex gap-1">
                      {blog.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${blog.slug}`} className="hover:text-primary">
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">By {blog.author?.name}</div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${blog.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button key={page} variant={page === pagination.page ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/blog?page=${page}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}`}>
                    {page}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}
    </div>
  )
}
