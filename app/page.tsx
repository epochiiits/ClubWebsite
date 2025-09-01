import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Code, Zap, ArrowRight, Github, ExternalLink, MapPin, Clock } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import CTASection from "@/components/CTAsection"

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
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Now a Client Component */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">What We Offer</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Everything you need to advance your tech career</h2>
            <p className="text-xl text-muted-foreground">Comprehensive resources and community support for your growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: "Regular Events",
                description: "Weekly workshops, hackathons, and tech talks"
              },
              {
                icon: Code,
                title: "Hands-on Projects",
                description: "Build real-world applications and contribute to open source"
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with like-minded developers and industry professionals"
              },
              {
                icon: Zap,
                title: "Skill Building",
                description: "Learn cutting-edge technologies and best practices"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-background/70 backdrop-blur-sm hover:bg-background">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {blogs.length > 0 && (
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">Latest Insights</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Latest Blog Posts</h2>
                <p className="text-xl text-muted-foreground">Stay updated with our latest insights and tutorials</p>
              </div>
              <Button variant="outline" className="hidden md:flex items-center gap-2" asChild>
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any, index: number) => (
                <Card key={blog._id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 bg-card overflow-hidden flex flex-col">
                  {blog.featuredImage && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={blog.featuredImage || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <time className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {blog.author?.name?.charAt(0) || 'A'}
                        </div>
                        <span className="font-medium text-foreground">{blog.author?.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${blog.slug}`} className="flex items-center gap-1">
                          Read More
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Button variant="outline" className="flex items-center gap-2 mx-auto" asChild>
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-24 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">Showcase</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Projects</h2>
                <p className="text-xl text-muted-foreground">Check out some of our amazing community projects</p>
              </div>
              <Button variant="outline" className="hidden md:flex items-center gap-2" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project: any) => (
                <Card key={project._id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 bg-background overflow-hidden">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold text-foreground mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack?.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" className="flex items-center gap-2 flex-1" asChild>
                          <Link href={project.githubUrl} target="_blank">
                            <Github className="w-4 h-4" />
                            Code
                          </Link>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" className="flex items-center gap-2 flex-1" asChild>
                          <Link href={project.liveUrl} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Button variant="outline" className="flex items-center gap-2 mx-auto" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">Don't Miss Out</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Upcoming Events</h2>
                <p className="text-xl text-muted-foreground">Join our exciting upcoming events and grow your network</p>
              </div>
              <Button variant="outline" className="hidden md:flex items-center gap-2" asChild>
                <Link href="/events">
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.slice(0, 2).map((event: any) => (
                <Card key={event._id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 bg-card overflow-hidden flex flex-col">
                  {event.image && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-6">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">{event.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.venue}
                      </div>
                      {event.maxAttendees && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          Max {event.maxAttendees} attendees
                        </div>
                      )}
                    </div>
                    <Button className="w-full font-semibold" asChild>
                      <Link href={`/events/${event._id}`} className="flex items-center justify-center gap-2">
                        View Details & RSVP
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Button variant="outline" className="flex items-center gap-2 mx-auto" asChild>
                <Link href="/events">
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Elements 
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm">
            🎯 Ready to level up your career?
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Sign up today and start your journey with fellow tech enthusiasts. Access exclusive events, resources, and
            networking opportunities that will accelerate your growth.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 group" asChild>
              <Link href="/events" className="flex items-center gap-2">
                Join Next Event
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 group" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section> */}
      <CTASection />
    </div>
  )
}

