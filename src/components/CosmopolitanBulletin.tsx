import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, User, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"

interface BulletinPost {
  id: string
  title: string
  content: string
  author_name: string
  author_email: string
  image_url?: string
  status: string
  created_at: string
  updated_at: string
}

interface CosmopolitanBulletinProps {
  autoRotateInterval?: number
  className?: string
}

export function CosmopolitanBulletin({
  autoRotateInterval = 5000,
  className = ""
}: CosmopolitanBulletinProps) {
  const [posts, setPosts] = useState<BulletinPost[]>([])
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BulletinPost | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  // Fetch bulletin posts from database
  useEffect(() => {
    fetchBulletinPosts()
  }, [])

  const fetchBulletinPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('cosmopolitan_bulletins')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5) // Limit to 5 posts for the floating card

      if (error) {
        console.error('Error fetching bulletin posts:', error)
        return
      }

      setPosts((data || []) as BulletinPost[])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isHovered || posts.length === 0) return

    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoRotateInterval / 100))
      } else {
        setCurrentPostIndex((prev) => (prev + 1) % posts.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, posts.length, autoRotateInterval, isHovered])

  const currentPost = posts[currentPostIndex]

  const handlePostClick = (index: number) => {
    setCurrentPostIndex(index)
    setProgress(0)
  }

  const handleReadClick = (post: BulletinPost) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Don't render if no posts, still loading, or dismissed
  if (loading || posts.length === 0 || isDismissed) {
    return null
  }

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 w-80 md:w-96 ${className}`}>
        <Card 
          className="bg-card/95 backdrop-blur-sm border-border shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base md:text-lg text-foreground">
                    Cosmopolitan Bulletin
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-sans">
                    Cell for International Law and Governance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-navy text-white hover:bg-navy hover:text-white cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {currentPostIndex + 1}/{posts.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    onClick={() => setIsDismissed(true)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-muted rounded-full h-1">
                <motion.div
                  className="bg-navy h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Main content */}
            <div className="p-3 md:p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 md:space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs border-burgundy text-burgundy">
                      Bulletin
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(currentPost.created_at)}
                    </div>
                  </div>

                  <h4 className="font-serif font-semibold text-foreground leading-tight line-clamp-2 text-sm md:text-base">
                    {currentPost.title}
                  </h4>

                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 font-sans">
                    {currentPost.content.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-20 md:max-w-32">{currentPost.author_name}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 md:h-8 px-2 hover:bg-navy hover:text-white text-xs"
                      onClick={() => handleReadClick(currentPost)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Read
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="px-3 md:px-4 pb-3 md:pb-4">
              <div className="flex justify-center gap-1 md:gap-2">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePostClick(index)}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
                      index === currentPostIndex
                        ? "bg-navy"
                        : "bg-muted hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animated Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 bg-navy text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50"
            >
              Bulletin {currentPostIndex + 1} of {posts.length}
              <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-navy"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Modal for full bulletin */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="relative">
            <DialogTitle className="text-xl font-serif font-bold pr-8">
              {selectedPost?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedPost && formatDate(selectedPost.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{selectedPost?.author_name}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            {selectedPost?.image_url && (
              <div className="w-full">
                <img 
                  src={selectedPost.image_url} 
                  alt="Bulletin" 
                  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md" 
                />
              </div>
            )}
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground font-sans text-base leading-relaxed">
                {selectedPost?.content}
              </div>
            </div>
          </div>
          <DialogClose asChild>
            <Button className="mt-6 w-full" variant="secondary">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function CosmopolitanBulletinDemo() {
  return <CosmopolitanBulletin />
} 