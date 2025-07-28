import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Gallery from "@/models/Gallery"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    console.log("Fetching gallery with ID:", id)

    await connectDB()

    const gallery = await Gallery.findById(id)
    if (!gallery) {
      console.log("Gallery not found for ID:", id)
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    console.log("Gallery found:", gallery.eventName)
    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    await connectDB()

    const gallery = await Gallery.findByIdAndUpdate(id, body, { new: true })
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Gallery update error:", error)
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const gallery = await Gallery.findByIdAndDelete(id)
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Gallery deleted successfully" })
  } catch (error) {
    console.error("Gallery delete error:", error)
    return NextResponse.json({ error: "Failed to delete gallery" }, { status: 500 })
  }
}
