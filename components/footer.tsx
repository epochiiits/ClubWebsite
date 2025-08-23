import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <Twitter className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; 2025 Epoch. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/about"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
