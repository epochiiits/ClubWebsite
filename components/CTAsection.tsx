"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Lottie from "lottie-react"
import ctaAnimation from "@/public/lottie/Rocket.json" // Replace with your Lottie file

export default function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 items-center gap-16">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/90 text-sm">
            🎯 Ready to level up your career?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl leading-relaxed">
            Sign up today and start your journey with fellow tech enthusiasts. Access exclusive events, resources, and
            networking opportunities that will accelerate your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-2xl hover:scale-105 group" asChild>
              <Link href="/events" className="flex items-center gap-2">
                Join Next Event
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-2xl hover:scale-105 group" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Animation Section */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px]">
            <Lottie 
              animationData={ctaAnimation}
              loop
              className="w-full h-full drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse opacity-50"></div>
            <div className="absolute inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000 opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
