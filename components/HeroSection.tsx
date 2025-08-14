// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight } from "lucide-react"
// import { Typewriter } from 'react-simple-typewriter'
// import Lottie from 'lottie-react'
// import heroAnimation from '@/public/lottie/SpaceBoy.json'

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Floating Particles */}
//       <div className="absolute inset-0">
//         {[...Array(30)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`
//             }}
//           ></div>
//         ))}
//       </div>

//       <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
//         <div className="mx-auto max-w-4xl">
//           <div className="mb-8 inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-foreground text-sm font-medium">
//             🚀 Welcome to the future of tech community
//           </div>

//           {/* Lottie Animation */}
//           <div className="mx-auto mb-8 w-64 h-64">
//             <Lottie animationData={heroAnimation} loop={true} />
//           </div>

//           {/* Typewriter Heading */}
//           <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight">
//             Welcome to{' '}
//             <span className="text-primary">
//               <Typewriter
//                 words={['Epoch', 'Innovation', 'Tech Revolution']}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={80}
//                 deleteSpeed={50}
//                 delaySpeed={1500}
//               />
//             </span>
//           </h1>

//           <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
//             Join our community of passionate developers and tech enthusiasts. Learn, build, and grow
//             together through workshops, projects, and networking events.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//             <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group" asChild>
//               <Link href="/events" className="flex items-center gap-2">
//                 Upcoming Events
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </Button>
//             <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm" asChild>
//               <Link href="/about">Learn More</Link>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground animate-bounce">
//         <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-primary/60 rounded-full mt-2 animate-pulse"></div>
//         </div>
//       </div>
//     </section>
//   )
// }
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import Lottie from "lottie-react";
import heroAnimation from "@/public/lottie/SpaceBoy.json";
import { useEffect, useState } from "react";

export default function HeroSection() {
  // Use client-side state for particle positions
  const [particles, setParticles] = useState<
    Array<{
      left: string;
      top: string;
      delay: string;
      duration: string;
    }>
  >([]);

  // Generate particles after component mounts
  useEffect(() => {
    const newParticles = Array(30)
      .fill(null)
      .map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
      }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Welcome Badge */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-foreground text-sm font-medium">
            🚀 Welcome to the future of tech community
          </div>
        </div>

        {/* Main Content - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[60vh]">
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Typewriter Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
                Welcome to{" "}
                <span className="block text-primary mt-2">
                  <Typewriter
                    words={["Epoch", "Innovation"]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
              Join our community of passionate developers and
              tech enthusiasts. Learn, build, and grow together
              through workshops, projects, and networking events.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group h-14"
                asChild
              >
                <Link
                  href="/events"
                  className="flex items-center gap-2"
                >
                  Upcoming Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm h-14"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Lottie Animation */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px]">
              <Lottie
                animationData={heroAnimation}
                loop={true}
                className="w-full h-full drop-shadow-2xl"
              />
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
              <div className="absolute inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000 opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
