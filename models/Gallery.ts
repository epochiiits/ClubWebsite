import mongoose from "mongoose"

const gallerySchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema)
