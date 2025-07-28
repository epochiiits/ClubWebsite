import mongoose from "mongoose"
import connectDB from "../lib/mongodb.js"
import Blog from "../models/Blog.js"
import Gallery from "../models/Gallery.js"

async function testDatabase() {
  try {
    await connectDB()
    console.log("✅ Database connected successfully")

    // Test blogs
    const blogs = await Blog.find().limit(5)
    console.log(`📝 Found ${blogs.length} blogs`)

    if (blogs.length > 0) {
      const firstBlog = blogs[0]
      console.log(`   First blog: "${firstBlog.title}" (slug: ${firstBlog.slug}, published: ${firstBlog.published})`)
    }

    // Test galleries
    const galleries = await Gallery.find().limit(5)
    console.log(`🖼️  Found ${galleries.length} galleries`)

    if (galleries.length > 0) {
      const firstGallery = galleries[0]
      console.log(`   First gallery: "${firstGallery.eventName}" (${firstGallery.images?.length || 0} images)`)
    }

    await mongoose.connection.close()
    console.log("✅ Database connection closed")
  } catch (error) {
    console.error("❌ Database test failed:", error)
    process.exit(1)
  }
}

testDatabase()
