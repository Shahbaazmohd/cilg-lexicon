import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ExternalLink, Filter, Upload, Trash2, Eye, Plus, Edit } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Event, EventService } from '@/lib/eventService';
import { sessionService } from '@/lib/sessionService';
import { supabase } from '@/integrations/supabase/client';
import EventImageUpload from '@/components/EventImageUpload';

const AdminEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    type: 'conference',
    date: '',
    time: '',
    location: '',
    isVirtual: false,
    description: '',
    speakers: [],
    registrationUrl: '',
    capacity: undefined,
    registered: 0,
    image: '',
    status: 'upcoming',
    featured: false
  });

  useEffect(() => {
    // Check if user is logged in using session service
    if (!sessionService.isLoggedIn()) {
      navigate('/admin/login');
    } else {
      loadEvents();
    }
  }, [navigate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await EventService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionService.clearSession();
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new CustomEvent('sessionChange'));
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'conference',
      date: '',
      time: '',
      location: '',
      isVirtual: false,
      description: '',
      speakers: [],
      registrationUrl: '',
      capacity: undefined,
      registered: 0,
      image: '',
      status: 'upcoming',
      featured: false
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      ...event,
      // Convert speakers array to comma-separated string for the form
      speakers: event.speakers
    });
    setShowForm(true);
  };

  const handleImageSelected = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Convert speakers string to array if needed
    const speakersArray = Array.isArray(formData.speakers) 
      ? formData.speakers 
      : (formData.speakers as string).split(',').map(s => s.trim()).filter(Boolean);

    try {
      setIsUploading(true);
      
      // Prepare event data
      const eventData = {
        ...formData,
        speakers: speakersArray
      };

      console.log('Submitting event data:', eventData);

      // Update or insert event in database
      let result;
      if (editingEvent) {
        // Update existing event
        console.log('Updating existing event with ID:', editingEvent.id);
        const { data, error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        console.log('Update successful:', data);
        result = true;
      } else {
        // Insert new event
        console.log('Creating new event');
        const { data, error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        console.log('Insert successful:', data);
        result = true;
      }

      if (result) {
        toast({
          title: 'Success',
          description: `Event ${editingEvent ? 'updated' : 'created'} successfully`,
        });
        resetForm();
        loadEvents();
      }
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingEvent ? 'update' : 'create'} event: ${error.message || 'Please try again.'}`,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, imageUrl: string | null) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      // Delete image from storage if it exists
      if (imageUrl) {
        await EventService.deleteEventImage(imageUrl);
      }

      // Delete event from database
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ featured: !currentFeatured })
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      toast({
        title: "Featured Status Updated",
        description: `Event ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });

      loadEvents();
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Event Management</h1>
              <p className="text-muted-foreground mt-2">
                Create, edit, and manage events and their images
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add New Event'}
            </Button>
          </div>

          {/* Event Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
                <CardDescription>
                  {editingEvent ? 'Update the event details below' : 'Fill in the details to create a new event'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter event title"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Event Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({...formData, type: value as Event['type']})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="lecture">Lecture</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        placeholder="e.g. 09:00 AM - 05:00 PM"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Event location"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVirtual"
                        checked={formData.isVirtual}
                        onCheckedChange={(checked) => setFormData({...formData, isVirtual: checked})}
                      />
                      <Label htmlFor="isVirtual">Virtual Event</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Event description"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="speakers">Speakers (comma separated)</Label>
                      <Input
                        id="speakers"
                        value={Array.isArray(formData.speakers) ? formData.speakers.join(', ') : formData.speakers || ''}
                        onChange={(e) => setFormData({...formData, speakers: e.target.value})}
                        placeholder="e.g. Dr. Jane Smith, Prof. John Doe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="registrationUrl">Registration URL (optional)</Label>
                      <Input
                        id="registrationUrl"
                        value={formData.registrationUrl || ''}
                        onChange={(e) => setFormData({...formData, registrationUrl: e.target.value})}
                        placeholder="https://example.com/register"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacity">Capacity (optional)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || undefined})}
                        placeholder="Maximum attendees"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => setFormData({...formData, status: value as Event['status']})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="past">Past</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Event Image</Label>
                    <div className="mt-2">
                      <EventImageUpload 
                        onImageSelected={handleImageSelected}
                        currentImage={formData.image}
                        onImageRemoved={() => setFormData(prev => ({ ...prev, image: '' }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Events</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first event</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Event
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="md:flex">
                      <div className="md:w-1/4 relative">
                        <img
                          src={event.image || EventService.getFallbackEventImage()}
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = EventService.getFallbackEventImage();
                          }}
                        />
                        <Badge className={`absolute top-2 left-2 ${getEventTypeColor(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        {event.isVirtual && (
                          <Badge variant="outline" className="absolute top-2 right-2 bg-white/80">
                            Virtual
                          </Badge>
                        )}
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                              {event.capacity && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {event.registered || 0} / {event.capacity}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={event.status === 'upcoming' ? 'default' : (event.status === 'ongoing' ? 'secondary' : 'outline')}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                            {event.featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm line-clamp-2 mb-4">{event.description}</p>
                        
                        {event.speakers.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-1">Speakers:</p>
                            <div className="flex flex-wrap gap-1">
                              {event.speakers.map((speaker, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {speaker}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleFeatured(event.id, event.featured)}
                          >
                            {event.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {event.image && (
                            <Button size="sm" variant="outline" onClick={() => window.open(event.image, '_blank')}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Image
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id, event.image)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;