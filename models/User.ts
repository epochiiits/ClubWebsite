import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  name: string
  image?: string
  password?: string
  role: "admin" | "user"
  provider: string
  providerId: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      // Only required for credentials provider
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
