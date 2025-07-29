import mongoose, { Schema, type Document } from "mongoose"

export interface IRSVP extends Document {
  event: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  ticketId: string
  createdAt: Date
  updatedAt: Date
}

const RSVPSchema = new Schema<IRSVP>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

RSVPSchema.index({ event: 1, user: 1 }, { unique: true })

export default mongoose.models.RSVP || mongoose.model<IRSVP>("RSVP", RSVPSchema)
