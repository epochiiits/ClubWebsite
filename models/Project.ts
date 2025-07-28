import mongoose, { Schema, type Document } from "mongoose"

export interface IProject extends Document {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    githubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    image: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
