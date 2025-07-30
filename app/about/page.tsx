import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Heart, Zap } from "lucide-react"

export const metadata = {
  title: "About Us - Epoch",
  description: "Learn about our mission, vision, and the team behind Epoch",
}

export default function AboutPage() {
  const team = [
    {
      name: "Alex Johnson",
      role: "President",
      bio: "Full-stack developer with 5+ years experience. Passionate about building inclusive tech communities.",
      skills: ["React", "Node.js", "Python", "Leadership"],
    },
    {
      name: "Sarah Chen",
      role: "Vice President",
      bio: "UI/UX designer and frontend developer. Loves creating beautiful and accessible user experiences.",
      skills: ["Design", "React", "TypeScript", "Figma"],
    },
    {
      name: "Mike Rodriguez",
      role: "Technical Lead",
      bio: "DevOps engineer and cloud architect. Enjoys mentoring and sharing knowledge about scalable systems.",
      skills: ["AWS", "Docker", "Kubernetes", "Go"],
    },
    {
      name: "Emily Davis",
      role: "Events Coordinator",
      bio: "Project manager turned developer. Specializes in organizing engaging tech events and workshops.",
      skills: ["Event Planning", "JavaScript", "Project Management", "Community Building"],
    },
  ]

  const values = [
    {
      icon: Users,
      title: "Inclusive Community",
      description:
        "We welcome developers of all skill levels and backgrounds. Everyone has something valuable to contribute.",
    },
    {
      icon: Target,
      title: "Continuous Learning",
      description: "Technology evolves rapidly. We foster an environment of continuous learning and knowledge sharing.",
    },
    {
      icon: Heart,
      title: "Collaboration",
      description: "Great things happen when we work together. We encourage collaboration on projects and ideas.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We embrace new technologies and encourage creative problem-solving and innovative thinking.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Epoch</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're a community of passionate developers, designers, and tech enthusiasts dedicated to learning, building,
          and growing together in the ever-evolving world of technology.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To create an inclusive and supportive environment where technology enthusiasts can learn, collaborate, and
              innovate together. We strive to bridge the gap between academic learning and real-world application
              through hands-on projects, workshops, and mentorship opportunities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the premier tech community that empowers individuals to reach their full potential in technology
              careers. We envision a future where our members become industry leaders, innovative entrepreneurs, and
              positive contributors to the global tech ecosystem.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <value.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Do */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Workshops & Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Regular workshops covering the latest technologies, coding bootcamps, hackathons, and tech talks by
                industry professionals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Collaborative projects that allow members to work together, learn from each other, and build impressive
                portfolios.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connecting experienced developers with newcomers to provide guidance, career advice, and technical
                support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <CardTitle className="text-center">{member.name}</CardTitle>
                <CardDescription className="text-center font-medium text-primary">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Epoch was founded in 2020 by a group of computer science students who wanted to create a more
              collaborative and practical learning environment. What started as informal study sessions quickly grew
              into a thriving community of over 500 members.
            </p>
            <p>
              Over the years, we've organized more than 100 workshops, hosted 50+ guest speakers from top tech
              companies, and facilitated countless project collaborations. Our members have gone on to work at leading
              tech companies, start their own ventures, and contribute to open-source projects worldwide.
            </p>
            <p>
              Today, Epoch continues to evolve, embracing new technologies and adapting to the changing needs of our
              community. We're proud of our journey and excited about the future we're building together.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
