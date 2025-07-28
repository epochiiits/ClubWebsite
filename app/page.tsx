import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Code, Zap } from "lucide-react"

async function getLatestContent() {
  try {
    const [blogsRes, projectsRes, eventsRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/blogs?published=true&limit=3`, { cache: "no-store" }),
      fetch(`${process.env.NEXTAUTH_URL}/api/projects?featured=true`, { cache: "no-store" }),
      fetch(`${process.env.NEXTAUTH_URL}/api/events?upcoming=true`, { cache: "no-store" }),
    ])

    const blogs = blogsRes.ok ? await blogsRes.json() : { blogs: [] }
    const projects = projectsRes.ok ? await projectsRes.json() : []
    const events = eventsRes.ok ? await eventsRes.json() : []

    return { blogs: blogs.blogs || [], projects, events }
  } catch (error) {
    return { blogs: [], projects: [], events: [] }
  }
}

export default async function HomePage() {
  const { blogs, projects, events } = await getLatestContent()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome to <span className="text-primary">TechClub</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join our community of passionate developers, designers, and tech enthusiasts. Learn, build, and grow
              together through workshops, projects, and networking events.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/events">Upcoming Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What We Offer</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to advance your tech career</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="h-8 w-8" />
                </div>
                <dt className="text-base font-semibold leading-7 text-foreground">Regular Events</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  Weekly workshops, hackathons, and tech talks
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Code className="h-8 w-8" />
                </div>
                <dt className="text-base font-semibold leading-7 text-foreground">Hands-on Projects</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  Build real-world applications and contribute to open source
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="h-8 w-8" />
                </div>
                <dt className="text-base font-semibold leading-7 text-foreground">Community</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  Connect with like-minded developers and industry professionals
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-8 w-8" />
                </div>
                <dt className="text-base font-semibold leading-7 text-foreground">Skill Building</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  Learn cutting-edge technologies and best practices
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {blogs.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Latest Blog Posts</h2>
              <p className="mt-4 text-lg text-muted-foreground">Stay updated with our latest insights and tutorials</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {blogs.map((blog: any) => (
                <Card key={blog._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-x-4 text-xs">
                      <time className="text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</time>
                      <div className="flex gap-2">
                        {blog.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary">
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
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-x-4">
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-foreground">{blog.author?.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Projects</h2>
              <p className="mt-4 text-lg text-muted-foreground">Check out some of our amazing community projects</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {projects.slice(0, 3).map((project: any) => (
                <Card key={project._id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack?.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={project.githubUrl} target="_blank">
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" asChild>
                          <Link href={project.liveUrl} target="_blank">
                            Live Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Upcoming Events</h2>
              <p className="mt-4 text-lg text-muted-foreground">Don't miss out on our exciting upcoming events</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {events.slice(0, 2).map((event: any) => (
                <Card key={event._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{event.title}</CardTitle>
                      <Badge variant="secondary">{new Date(event.date).toLocaleDateString()}</Badge>
                    </div>
                    <CardDescription>📍 {event.venue}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                    <Button asChild>
                      <Link href={`/events/${event._id}`}>View Details & RSVP</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Join Our Community?</h2>
            <p className="mt-6 text-lg leading-8 opacity-90">
              Sign up today and start your journey with fellow tech enthusiasts. Access exclusive events, resources, and
              networking opportunities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/events">Join Next Event</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link
                  href="/contact"
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
