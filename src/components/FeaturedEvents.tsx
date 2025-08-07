import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, MapPin, Clock, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Event, EventService } from "@/lib/eventService"

interface FeaturedEventsProps {
  autoRotateInterval?: number;
  className?: string;
}

export function FeaturedEvents({
  autoRotateInterval = 5000,
  className = ""
}: FeaturedEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  // Fetch featured events from database
  useEffect(() => {
    fetchFeaturedEvents()
  }, [])

  const fetchFeaturedEvents = async () => {
    try {
      const eventsData = await EventService.getAllEvents()
      const featuredEvents = eventsData.filter(event => event.featured && event.status === 'upcoming')
      setEvents(featuredEvents.slice(0, 5)) // Limit to 5 events for the floating card
    } catch (error) {
      console.error('Error fetching featured events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isHovered || events.length === 0) return

    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoRotateInterval / 100))
      } else {
        setCurrentEventIndex((prev) => (prev + 1) % events.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, events.length, autoRotateInterval, isHovered])

  const currentEvent = events[currentEventIndex]

  const handleEventClick = (index: number) => {
    setCurrentEventIndex(index)
    setProgress(0)
  }

  const handleViewClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventTypeColor = (type: string) => {
    const colors = {
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      lecture: 'bg-purple-100 text-purple-800',
      seminar: 'bg-orange-100 text-orange-800',
      webinar: 'bg-cyan-100 text-cyan-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Don't render if no events, still loading, or dismissed
  if (loading || events.length === 0 || isDismissed) {
    return null
  }

  return (
    <>
      <div className={`fixed bottom-4 left-4 z-50 w-80 md:w-96 ${className}`}>
        <Card 
          className="bg-card/95 backdrop-blur-sm border-border shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Featured Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  <span className="text-xs">?</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsDismissed(true)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Event Indicators */}
            <div className="flex justify-center space-x-1 p-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentEventIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={() => handleEventClick(index)}
                />
              ))}
            </div>

            {/* Event Content */}
            <div className="p-3 md:p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 md:space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      Event
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(currentEvent.date)}
                    </div>
                  </div>

                  <h4 className="font-serif font-semibold text-foreground leading-tight line-clamp-2 text-sm md:text-base">
                    {currentEvent.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentEvent.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentEvent.time}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 font-sans">
                    {currentEvent.description.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <Badge className={`text-xs ${getEventTypeColor(currentEvent.type)}`}>
                      {currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1)}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewClick(currentEvent)}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover text-popover-foreground text-xs rounded border shadow-lg max-w-64">
            <p>Featured upcoming events from our academic calendar. Click to view details or dismiss to hide.</p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedEvent && formatDate(selectedEvent.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedEvent?.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedEvent?.location}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedEvent?.image && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={selectedEvent ? getEventTypeColor(selectedEvent.type) : ''}>
                  {selectedEvent?.type.charAt(0).toUpperCase() + selectedEvent?.type.slice(1)}
                </Badge>
                {selectedEvent?.isVirtual && (
                  <Badge variant="outline">Virtual</Badge>
                )}
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Featured
                </Badge>
              </div>
              
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {selectedEvent?.description}
              </p>
              
              {selectedEvent?.speakers && selectedEvent.speakers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Speakers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.speakers.map((speaker, index) => (
                      <Badge key={index} variant="secondary">
                        {speaker}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEvent?.registrationUrl && (
                <Button asChild className="w-full">
                  <a href={selectedEvent.registrationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Register Now
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}
