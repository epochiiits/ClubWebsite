"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import ShootingStars from "@/components/shooting-stars"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define routes where you want to hide navbar/footer
  const authRoutes = ['/auth/signin']
  const isAuthRoute = authRoutes.includes(pathname)

  return (
    <>
      {/* Shooting stars background - only show on non-auth pages */}
      {!isAuthRoute && (
        <>
          {/* <ShootingStars /> */}
        </>
      )}
      <div className="min-h-screen flex flex-col relative z-10">
        {!isAuthRoute && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  )
}