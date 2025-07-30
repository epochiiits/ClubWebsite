import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

async function getProjects() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/projects`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch projects")
    return await response.json()
  } catch (error) {
    return []
  }
}

export const metadata = {
  title: "Projects - Epoch",
  description: "Explore amazing projects built by our community members",
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the amazing projects built by our community members. From web applications to mobile apps and
          everything in between.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card key={project._id} className="flex flex-col">
              {project.image && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  {project.featured && <Badge variant="secondary">Featured</Badge>}
                </div>
                <CardDescription className="line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.githubUrl} target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Link>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild>
                      <Link href={project.liveUrl} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available yet.</p>
        </div>
      )}
    </div>
  )
}
