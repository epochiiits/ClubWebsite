import { z } from "zod"

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  slug: z.string().min(1, "Slug is required").optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional().or(z.literal("")),
  published: z.boolean().default(false),
})

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
})

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  venue: z.string().min(1, "Venue is required"),
  maxAttendees: z.number().min(1, "Max attendees must be at least 1"),
  image: z.string().url().optional().or(z.literal("")),
})

export const podcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL"),
  duration: z.string().optional(),
})

export const gallerySchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  description: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        caption: z.string().optional(),
      }),
    )
    .min(1, "At least one image is required"),
})

export const rsvpSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
})
