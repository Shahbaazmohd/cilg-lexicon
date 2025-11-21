"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Instagram, Linkedin, Send, Mail, MapPin, ExternalLink } from "lucide-react"

function FooterSection() {
  const [email, setEmail] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="relative border-t bg-primary text-primary-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="relative text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-3">
              <img 
                src="/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png" 
                alt="CILG Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="font-serif font-bold text-lg sm:text-xl">CILG</span>
            </div>
            <h2 className="mb-3 text-lg sm:text-xl font-serif font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-3 text-sm text-primary-foreground/80">
              Join our newsletter for the latest research updates and academic discourse.
            </p>
            <form className="relative max-w-sm mx-auto sm:mx-0" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-12 backdrop-blur-sm bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-academic hover:bg-academic/90 text-academic-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-academic/20 blur-2xl" />
          </div>

          {/* Quick Links and Publications - Side by side on mobile */}
          <div className="flex flex-row gap-6 md:contents">
            {/* Quick Links */}
            <div className="text-center sm:text-left flex-1 md:flex-none">
              <h3 className="mb-3 text-base sm:text-lg font-serif font-semibold">Quick Links</h3>
              <nav className="space-y-1 text-sm">
                <Link to="/" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Home
                </Link>
                <Link to="/about" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  About Us
                </Link>
                <Link to="/blog" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Blog
                </Link>
                <Link to="/submit-blog" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Submit Blog
                </Link>
                <Link to="/events" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Events
                </Link>
              </nav>
            </div>

            {/* Publications */}
            <div className="text-center sm:text-left flex-1 md:flex-none">
              <h3 className="mb-3 text-base sm:text-lg font-serif font-semibold">Publications</h3>
              <nav className="space-y-1 text-sm">
                <Link to="/bulletin" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Cosmopolitan Bulletin
                </Link>
                <a href="#" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80 flex items-center justify-center sm:justify-start space-x-1">
                  <span>Research Papers</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <Link to="/resources" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Resources
                </Link>
                <Link to="/team" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Meet the Team
                </Link>
                <Link to="/admin/login" className="block py-1.5 transition-colors hover:text-academic text-primary-foreground/80">
                  Admin Login
                </Link>
              </nav>
            </div>
          </div>

          {/* Contact Information */}
          <div className="relative text-center sm:text-left">
            <h3 className="mb-3 text-base sm:text-lg font-serif font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <div className="flex items-start justify-center sm:justify-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary-foreground/60 flex-shrink-0" />
                <p className="text-primary-foreground/80">usllscilg@gmail.com</p>
              </div>
              <div className="flex items-start justify-center sm:justify-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-foreground/60 flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground/80">USLLS, GGSIPU</p>
                  <p className="text-primary-foreground/80">Dwarka, Delhi- 110078</p>
                </div>
              </div>
            </address>
            
            {/* Social Media */}
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-serif font-semibold">Follow Us</h4>
              <div className="flex justify-center sm:justify-start space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://www.linkedin.com/company/uslls-cilg/?originalSubdomain=in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group block p-2 -m-2"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-academic/20 border border-primary-foreground/20 hover:border-academic transition-all duration-300 group-hover:scale-110">
                          <Linkedin className="h-5 w-5 text-primary-foreground group-hover:text-academic" />
                        </div>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Connect with us on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://www.instagram.com/uslls_cilg/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group block p-2 -m-2"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:border-academic transition-all duration-300 group-hover:scale-110">
                          <Instagram className="h-5 w-5 text-primary-foreground group-hover:text-academic" />
                        </div>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/20 pt-4 sm:pt-6 text-center md:flex-row">
          <p className="text-xs sm:text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Cell for International Law and Governance. All rights reserved.
          </p>
          <nav className="flex gap-4 text-xs sm:text-sm">
            <Link to="/privacy" className="py-1.5 px-1 transition-colors hover:text-academic text-primary-foreground/60">
              Privacy Policy
            </Link>
            <Link to="/terms" className="py-1.5 px-1 transition-colors hover:text-academic text-primary-foreground/60">
              Terms of Use
            </Link>
            <a href="#" className="py-1.5 px-1 transition-colors hover:text-academic text-primary-foreground/60">
              Cookie Settings
            </a>
          </nav>
          <a
            href="https://www.linkedin.com/in/arham-ahmed2101"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-primary-foreground/60 transition-colors hover:text-academic"
          >
            Developed by Arham Ahmed
          </a>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection } 