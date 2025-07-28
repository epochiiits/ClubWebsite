import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  title: string
  description: string
  date: Date
  venue: string
  image?: string
  maxAttendees?: number
  rsvpDeadline?: Date
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    maxAttendees: {
      type: Number,
    },
    rsvpDeadline: {
      type: Date,
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

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)
