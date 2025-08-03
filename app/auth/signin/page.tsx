"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    setMounted(true)
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please use the same sign-in method you used before."
      case "EmailSignin":
        return "Check your email for a sign-in link."
      case "CredentialsSignin":
        return "Invalid email or password. Please check your credentials."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An error occurred during sign in. Please try again."
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      toast.error("Failed to sign in with Google")
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.6s ease-out forwards;
        }

        .animate-slide-in-top {
          animation: slideInFromTop 0.5s ease-out forwards;
        }

        .animate-slide-in-bottom {
          animation: slideInFromBottom 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-hover:hover {
          animation: pulse 0.6s ease-in-out;
        }

        .loading-shimmer {
          background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .bounce-icon {
          animation: bounce 2s infinite;
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px hsl(var(--primary) / 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .stagger-animation > * {
          opacity: 0;
          animation: slideInFromBottom 0.5s ease-out forwards;
        }

        .stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
        .stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
        .stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
        .stagger-animation > *:nth-child(4) { animation-delay: 0.4s; }
        .stagger-animation > *:nth-child(5) { animation-delay: 0.5s; }

        .gradient-bg {
          background: linear-gradient(135deg, 
            hsl(var(--background)) 0%, 
            hsl(var(--muted)) 25%, 
            hsl(var(--secondary)) 50%, 
            hsl(var(--muted)) 75%, 
            hsl(var(--background)) 100%);
        }

        .gradient-text {
          background: linear-gradient(135deg, 
            hsl(var(--primary)), 
            hsl(var(--accent)), 
            hsl(var(--primary)));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .lottie-container {
          opacity: 0;
          animation: slideInFromLeft 0.8s ease-out 0.3s forwards;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center gradient-bg px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="flex items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto relative z-10">
          {/* <div className="hidden lg:block lottie-container">
            <div className="w-80 h-80 animate-float">
              {mounted && (
                <Lottie 
                  animationData={SpaceBoy} 
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                />
              )}
            </div>
          </div> */}

          {/* Sign-in Card */}
          <Card className={`w-full max-w-md bg-card/90 backdrop-blur-lg border border-border/50 rounded-2xl shadow-2xl hover-glow relative ${mounted ? 'animate-fade-in-scale' : 'opacity-0'}`}>
            <CardHeader className="text-center space-y-2 pb-0">
              <CardTitle className={`text-3xl font-extrabold gradient-text ${mounted ? 'animate-slide-in-top' : 'opacity-0'}`}>
                Welcome to Epoch
              </CardTitle>
              <CardDescription className={`text-sm text-muted-foreground ${mounted ? 'animate-slide-in-top' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                Sign in to your personalized dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2 pb-8 px-6 stagger-animation">
              {error && (
                <Alert variant="destructive" className="animate-slide-in-bottom border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 bounce-icon text-destructive" />
                  <AlertDescription className="text-destructive-foreground">{getErrorMessage(error)}</AlertDescription>
                </Alert>
              )}

              {providers?.google && (
                <div className="space-y-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`w-full py-5 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-card border-2 border-border text-card-foreground hover:bg-muted relative overflow-hidden group ${loading ? 'loading-shimmer' : ''}`}
                    size="lg"
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"></div>
                        <span className="gradient-text">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285f4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wide">
                      <span className="bg-card/90 backdrop-blur-sm px-4 py-1 text-muted-foreground rounded-full border border-border">
                        Fast · Secure · Seamless
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Informational content */}
              <div className="space-y-3 text-center text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  Sign in with Google to access tools, projects, and your personalized dashboard —
                  all in one place.
                </p>
                <p>
                  Need help?{" "}
                  <a href="/support" className="text-primary underline hover:text-primary/80 transition-colors duration-200 hover:no-underline">
                    Contact support
                  </a>
                </p>
                <p className="text-xs leading-snug opacity-75">
                  By continuing, you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-foreground transition-colors duration-200">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" className="underline hover:text-foreground transition-colors duration-200">
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Lottie Animation */}
          {/* <div className="lg:hidden absolute top-8 left-1/2 transform -translate-x-1/2 lottie-container">
            <div className="w-32 h-32 animate-float">
              {mounted && (
                <Lottie 
                  animationData={SpaceBoy} 
                  loop={true}
                  autoplay={true}
                  className="w-full h-full opacity-60"
                />
              )}
            </div>
          </div> */}
        </div>
      </div>
    </>
  )
}
