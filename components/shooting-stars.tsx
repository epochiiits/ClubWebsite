"use client"

import React, { useEffect, useState } from "react"

interface Star {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
  size: number
  trailLength: number
  color: string
  brightness: number
  sparkles: number
}

export default function EnhancedShootingStars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = []
      const colors = [
        'rgb(255, 255, 255)', // White
        'rgb(147, 197, 253)', // Blue
        'rgb(251, 191, 36)', // Amber
        'rgb(248, 113, 113)', // Red
        'rgb(196, 181, 253)', // Purple
        'rgb(110, 231, 183)', // Green
      ]
      
      // Consistent diagonal angle (upper-left to lower-right)
      const baseAngle = Math.PI / 4 // 45 degrees
      const distance = 140 // Fixed travel distance
      
      for (let i = 0; i < 25; i++) {
        // Spread meteors across a much wider area
        const startX = Math.random() * 100 - 40 // Much wider spread horizontally
        const startY = Math.random() * 80 - 40 // Much wider spread vertically
        
        // All move in same diagonal direction
        const endX = startX + distance * Math.cos(baseAngle)
        const endY = startY + distance * Math.sin(baseAngle)
        
        newStars.push({
          id: i,
          startX,
          startY,
          endX,
          endY,
          duration: Math.random() * 2 + 2, // 2-4s for varied timing
          delay: Math.random() * 15, // Spread over longer time for better distribution
          size: Math.random() * 2 + 1, // Variable star size
          trailLength: Math.random() * 40 + 80, // Longer trails
          color: colors[Math.floor(Math.random() * colors.length)],
          brightness: Math.random() * 0.4 + 0.6, // Higher brightness
          sparkles: Math.floor(Math.random() * 3) + 2, // 2-4 sparkles
        })
      }
      
      setStars(newStars)
    }

    generateStars()
    const interval = setInterval(generateStars, 15000) // Longer interval for better spread
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Enhanced starfield background */}
      <div className="absolute inset-0">
        {/* Gradient background with nebula effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-950/20 to-transparent" />
        
        {/* Constellation patterns */}
        {Array.from({ length: 200 }).map((_, i) => {
          const size = Math.random() * 3 + 0.3
          const twinkle = Math.random() > 0.7
          
          return (
            <div
              key={`static-${i}`}
              className={`absolute rounded-full ${twinkle ? 'animate-pulse' : ''}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.8 + 0.2}) 0%, transparent 70%)`,
                animationDuration: twinkle ? `${Math.random() * 4 + 2}s` : undefined,
                animationDelay: twinkle ? `${Math.random() * 5}s` : undefined,
                boxShadow: size > 2 ? `0 0 ${size * 2}px rgba(255,255,255,0.3)` : undefined,
              }}
            />
          )
        })}
      </div>

      {/* Enhanced shooting stars */}
      {stars.map((star) => {
        const angle = Math.atan2(star.endY - star.startY, star.endX - star.startX)
        const distance = Math.sqrt(Math.pow(star.endX - star.startX, 2) + Math.pow(star.endY - star.startY, 2))
        
        return (
          <div key={star.id}>
            {/* Main shooting star */}
            <div
              className="absolute"
              style={{
                left: `${star.startX}%`,
                top: `${star.startY}%`,
                                    animation: `shootingStar-${star.id} ${star.duration}s linear ${star.delay}s infinite`,
              }}
            >
              <style>
                {`
                  @keyframes shootingStar-${star.id} {
                    0% {
                      transform: translate(0, 0);
                      opacity: 0;
                    }
                    3% {
                      opacity: ${star.brightness};
                    }
                    97% {
                      opacity: ${star.brightness};
                    }
                    100% {
                      transform: translate(${star.endX - star.startX}vw, ${star.endY - star.startY}vh);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes sparkle-${star.id} {
                    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                  }
                `}
              </style>
              
              <div style={{ transform: `rotate(${angle}rad)` }}>
                {/* Outer glow trail */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${star.trailLength * 1.2}px`,
                    height: `${star.size * 2}px`,
                    right: `${star.size * 2}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(90deg, transparent 0%, ${star.color.replace('rgb', 'rgba').replace(')', ', 0.1)')} 30%, ${star.color.replace('rgb', 'rgba').replace(')', ', 0.3)')} 70%, ${star.color} 100%)`,
                    filter: 'blur(2px)',
                    opacity: star.brightness * 0.6,
                  }}
                />
                
                {/* Main trail */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${star.trailLength}px`,
                    height: `${star.size * 1.2}px`,
                    right: `${star.size * 2}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(90deg, transparent 0%, ${star.color.replace('rgb', 'rgba').replace(')', ', 0.2)')} 20%, ${star.color.replace('rgb', 'rgba').replace(')', ', 0.6)')} 60%, ${star.color} 100%)`,
                    filter: 'blur(0.5px)',
                    opacity: star.brightness * 0.8,
                  }}
                />
                
                {/* Bright core trail */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: `${star.trailLength * 0.7}px`,
                    height: `${star.size * 0.6}px`,
                    right: `${star.size * 2}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.8) 80%, white 100%)`,
                    opacity: star.brightness,
                  }}
                />
                
                {/* Main star head */}
                <div
                  className="relative rounded-full"
                  style={{
                    width: `${star.size * 3}px`,
                    height: `${star.size * 3}px`,
                    background: `radial-gradient(circle, white 0%, ${star.color} 40%, ${star.color.replace('rgb', 'rgba').replace(')', ', 0.8)')} 70%, transparent 100%)`,
                    boxShadow: `
                      0 0 ${star.size * 4}px ${star.color.replace('rgb', 'rgba').replace(')', ', 0.8)')},
                      0 0 ${star.size * 8}px ${star.color.replace('rgb', 'rgba').replace(')', ', 0.4)')},
                      0 0 ${star.size * 12}px ${star.color.replace('rgb', 'rgba').replace(')', ', 0.2)')}
                    `,
                  }}
                >
                  {/* Sparkle effects around the star */}
                  {Array.from({ length: star.sparkles }).map((_, sparkleIndex) => {
                    const sparkleAngle = (sparkleIndex / star.sparkles) * Math.PI * 2
                    const sparkleDistance = star.size * 4 + Math.random() * star.size * 2
                    
                    return (
                      <div
                        key={sparkleIndex}
                        className="absolute bg-white"
                        style={{
                          width: '2px',
                          height: '2px',
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${Math.cos(sparkleAngle) * sparkleDistance}px, ${Math.sin(sparkleAngle) * sparkleDistance}px)`,
                          animation: `sparkle-${star.id} ${star.duration * 0.8}s ease-in-out ${star.delay + star.duration * 0.1}s infinite`,
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}