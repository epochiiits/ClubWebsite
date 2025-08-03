'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import HashLoader from 'react-spinners/HashLoader'

export const PageLoader = () => {
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 2000) 

    return () => clearTimeout(timeout)
  }, [pathname])

  if (!loading || !mounted) return null

  const isDark = resolvedTheme === 'dark'
  const loaderColor = isDark ? '#8B5CF6' : '#6366F1' 
  const backgroundColor = isDark ? 'black' : 'hsl(25, 35%, 96%)'

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-[9999] transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <HashLoader size={100} color={loaderColor} />
    </div>
  )
}