"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import { toast } from "sonner"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [searchTerm])

  const fetchProjects = async () => {
    try {
      const url = new URL("/api/projects", window.location.origin)
      if (searchTerm) url.searchParams.set("search", searchTerm)

      const response = await fetch(url.toString())
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      toast.error("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Project deleted successfully")
        fetchProjects()
      } else {
        throw new Error("Failed to delete project")
      }
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !featured }),
      })

      if (response.ok) {
        toast.success(`Project ${!featured ? "featured" : "unfeatured"} successfully`)
        fetchProjects()
      } else {
        throw new Error("Failed to update project")
      }
    } catch (error) {
      toast.error("Failed to update project")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Projects</h1>
          <p className="text-muted-foreground">Create and manage community projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage all community projects</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project: any) => (
                <TableRow key={project._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.techStack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.featured ? "default" : "secondary"}>
                      {project.featured ? "Featured" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={project.githubUrl} target="_blank">
                            <Github className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={project.liveUrl} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/projects/${project._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* <Button size="sm" variant="outline" onClick={() => toggleFeatured(project._id, project.featured)}>
                        {project.featured ? "Unfeature" : "Feature"}
                      </Button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProject(project._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
