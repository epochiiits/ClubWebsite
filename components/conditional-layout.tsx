"use client"

import { useEffect, useState } from 'react'
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageLoader } from "@/components/Loader"
import ShootingStars from "@/components/shooting-stars"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Track initial load to prevent loader on first render
  useEffect(() => {
    setIsInitialLoad(false)
  }, [])

  // Only show loader for client-side navigation, not initial page loads or home page
  useEffect(() => {
    if (!isInitialLoad && pathname !== '/') {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 1000) // Adjust timing as needed
      return () => clearTimeout(timer)
    }
  }, [pathname, isInitialLoad])

  // Define routes where you want to hide navbar/footer
  const authRoutes = ['/auth/signin']
  const isAuthRoute = authRoutes.includes(pathname)

  // Show loader for non-home page navigation
  if (isLoading && !isInitialLoad && pathname !== '/') {
    return <PageLoader />
  }

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
