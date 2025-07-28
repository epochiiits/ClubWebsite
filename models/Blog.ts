import mongoose, { Schema, type Document } from "mongoose"
import slugify from "slugify"

export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  author: mongoose.Types.ObjectId
  published: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

BlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)
