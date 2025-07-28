import mongoose, { Schema, type Document } from "mongoose"

export interface IPodcast extends Document {
  title: string
  description?: string
  youtubeUrl: string
  youtubeId: string
  thumbnail?: string
  duration?: string
  publishedAt: Date
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PodcastSchema = new Schema<IPodcast>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    youtubeUrl: {
      type: String,
      required: true,
    },
    youtubeId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    duration: {
      type: String,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Podcast || mongoose.model<IPodcast>("Podcast", PodcastSchema)
