"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Podcast", href: "/podcast" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleMenuToggle = () => {
    console.log(
      "Menu toggle clicked, current state:",
      mobileMenuOpen
    );
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    console.log("Closing menu");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-primary">
                Epoch
              </span>
            </Link>
          </div>

          {/* Mobile menu button - Added explicit z-index and pointer events */}
          <div className="flex lg:hidden relative z-50">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleMenuToggle}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen ? "Close menu" : "Open menu"
              }
            >
              <span className="sr-only">
                {mobileMenuOpen
                  ? "Close main menu"
                  : "Open main menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            <ThemeToggle />

            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">
                          {session.user.name}
                        </p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/my-rsvps">
                        <Settings className="mr-2 h-4 w-4" />
                        My RSVPs
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {session.user?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                        redirect: true,
                      })
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn("google")}>
                Sign in
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu - Moved outside header and increased z-index */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleMenuClose}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm border-l shadow-xl">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5"
                onClick={handleMenuClose}
              >
                <span className="text-2xl font-bold text-primary">
                  Epoch
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={handleMenuClose}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={handleMenuClose}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>

                  {session ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.user?.image || ""}
                            alt={session.user?.name || ""}
                          />
                          <AvatarFallback>
                            {session.user?.name?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={handleMenuClose}
                      >
                        Profile
                      </Link>

                      {session.user?.role !== "admin" && (
                        <Link
                          href="/my-rsvps"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={handleMenuClose}
                        >
                          My RSVPs
                        </Link>
                      )}

                      {session.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={handleMenuClose}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          signOut({
                            callbackUrl: "/",
                            redirect: true,
                          });
                          handleMenuClose();
                        }}
                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        signIn("google");
                        handleMenuClose();
                      }}
                      className="w-full"
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
