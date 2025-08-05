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
import { Facebook, Instagram, Linkedin, Send, Twitter, Mail, MapPin, ExternalLink } from "lucide-react"

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
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png" 
                alt="CILG Logo" 
                className="w-10 h-10"
              />
              <span className="font-serif font-bold text-xl">CILG</span>
            </div>
            <h2 className="mb-4 text-2xl font-serif font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-primary-foreground/80">
              Join our newsletter for the latest research updates and academic discourse.
            </p>
            <form className="relative" onSubmit={handleSubmit}>
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

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-serif font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Home
              </Link>
              <Link to="/about" className="block transition-colors hover:text-academic text-primary-foreground/80">
                About Us
              </Link>
              <Link to="/blog" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Blog
              </Link>
              <Link to="/submit-blog" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Submit Blog
              </Link>
              <Link to="/events" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Events
              </Link>
              <Link to="/resources" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Resources
              </Link>
            </nav>
          </div>

          {/* Publications */}
          <div>
            <h3 className="mb-4 text-lg font-serif font-semibold">Publications</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/bulletin" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Cosmopolitan Bulletin
              </Link>
              <a href="#" className="block transition-colors hover:text-academic text-primary-foreground/80 flex items-center space-x-1">
                <span>Research Papers</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <Link to="/team" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Meet the Team
              </Link>
              <Link to="/admin/login" className="block transition-colors hover:text-academic text-primary-foreground/80">
                Admin Login
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-serif font-semibold">Contact Us</h3>
            <address className="space-y-3 text-sm not-italic">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary-foreground/60" />
                <p className="text-primary-foreground/80">usllscilg@gmail.com</p>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-foreground/60" />
                <div>
                  <p className="text-primary-foreground/80">USLLS, GGSIPU</p>
                  <p className="text-primary-foreground/80">Dwarka, Delhi- 110078</p>
                </div>
              </div>
            </address>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-serif font-semibold">Follow Us</h4>
              <div className="flex space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-primary-foreground/20 hover:border-academic hover:bg-academic/10">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Facebook</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-primary-foreground/20 hover:border-academic hover:bg-academic/10">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-primary-foreground/20 hover:border-academic hover:bg-academic/10">
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-primary-foreground/20 hover:border-academic hover:bg-academic/10">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Connect with us on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 pt-8 text-center md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Centre for International Law and Governance. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link to="/privacy" className="transition-colors hover:text-academic text-primary-foreground/60">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-academic text-primary-foreground/60">
              Terms of Use
            </Link>
            <a href="#" className="transition-colors hover:text-academic text-primary-foreground/60">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection } 