// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { Providers } from "@/components/providers"
// import { Navbar } from "@/components/navbar"
// import { Footer } from "@/components/footer"
// import { Toaster } from "@/components/ui/sonner"
// import { PageLoader } from "@/components/Loader"
// import ShootingStars  from "@/components/shooting-stars"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Epoch - Innovation & Learning",
//   description: "Join Epoch for workshops, projects, and networking opportunities",
//   keywords: ["tech club", "programming", "workshops", "events", "projects"],
//   generator: 'Krishna'
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <Providers>
//           <PageLoader />
//           {/* Shooting stars background */}
//           {/* <ShootingStars /> */}
//           <div className="min-h-screen flex flex-col relative z-10">
//             <Navbar />
//             <main className="flex-1">{children}</main>
//             <Footer />
//           </div>
//           <Toaster />
//         </Providers>
//       </body>
//     </html>
//   )
// }

// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { Providers } from "@/components/providers"
// import { Toaster } from "@/components/ui/sonner"
// import { PageLoader } from "@/components/Loader"
// import { ConditionalLayout } from "@/components/conditional-layout"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Epoch - Innovation & Learning",
//   description: "Join Epoch for workshops, projects, and networking opportunities",
//   keywords: ["tech club", "programming", "workshops", "events", "projects"],
//   generator: 'Krishna'
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <Providers>
//           <PageLoader />
//           <ConditionalLayout>
//             {children}
//           </ConditionalLayout>
//           <Toaster />
//         </Providers>
//       </body>
//     </html>
//   )
// }
import './globals.css'
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { ConditionalLayout } from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Epoch - Innovation & Learning",
  description: "Join Epoch for workshops, projects, and networking opportunities",
  keywords: ["tech club", "programming", "workshops", "events", "projects"],
  generator: 'Krishna'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
