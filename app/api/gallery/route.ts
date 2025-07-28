import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Gallery from "@/models/Gallery"
import { gallerySchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const galleries = await Gallery.find().sort({ createdAt: -1 })
    return NextResponse.json(galleries)
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch galleries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Gallery data received:", body)

    const validatedData = gallerySchema.parse(body)

    await connectDB()

    const gallery = await Gallery.create(validatedData)

    return NextResponse.json(gallery, { status: 201 })
  } catch (error) {
    console.error("Gallery creation error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: (error as any).errors,
        },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: "Failed to create gallery" }, { status: 500 })
  }
}
