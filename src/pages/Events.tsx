import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'workshop' | 'lecture' | 'seminar' | 'webinar';
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  description: string;
  speakers: string[];
  registrationUrl?: string;
  capacity?: number;
  registered?: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

const Events = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('upcoming');

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'International Law Conference 2024: Digital Rights and Governance',
      type: 'conference',
      date: '2024-03-15',
      time: '09:00 AM - 05:00 PM',
      location: 'University Auditorium',
      isVirtual: false,
      description: 'A comprehensive conference exploring the intersection of digital technologies and international law, featuring leading experts from academia and practice.',
      speakers: ['Prof. Sarah Johnson', 'Dr. Michael Chen', 'Hon. Justice Williams'],
      registrationUrl: '#',
      capacity: 200,
      registered: 145,
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Climate Justice Workshop: Legal Frameworks for Action',
      type: 'workshop',
      date: '2024-02-28',
      time: '02:00 PM - 04:00 PM',
      location: 'Online',
      isVirtual: true,
      description: 'An interactive workshop examining legal mechanisms for addressing climate change and environmental justice issues.',
      speakers: ['Dr. Emma Rodriguez', 'Prof. David Kim'],
      registrationUrl: '#',
      capacity: 50,
      registered: 32,
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Guest Lecture: International Criminal Justice in the 21st Century',
      type: 'lecture',
      date: '2024-02-20',
      time: '03:30 PM - 05:00 PM',
      location: 'Law Faculty Building, Room 301',
      isVirtual: false,
      description: 'Distinguished guest lecture by a former ICC prosecutor on the evolution and challenges of international criminal justice.',
      speakers: ['Hon. Fatou Bensouda'],
      registrationUrl: '#',
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Research Seminar: Trade Law and Economic Sanctions',
      type: 'seminar',
      date: '2024-01-30',
      time: '11:00 AM - 12:30 PM',
      location: 'Conference Room A',
      isVirtual: false,
      description: 'Faculty research seminar discussing recent developments in international trade law and the use of economic sanctions.',
      speakers: ['Prof. Michael Chen', 'Dr. Sarah Johnson'],
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      status: 'past'
    },
    {
      id: '5',
      title: 'PhD Defense: Human Rights in Digital Spaces',
      type: 'seminar',
      date: '2024-01-15',
      time: '10:00 AM - 12:00 PM',
      location: 'Graduate School Auditorium',
      isVirtual: false,
      description: 'PhD dissertation defense examining the protection of human rights in digital environments.',
      speakers: ['Lisa Thompson (Candidate)', 'Prof. Emma Rodriguez (Supervisor)'],
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      status: 'past'
    }
  ]);

  const eventTypes = ['all', 'conference', 'workshop', 'lecture', 'seminar', 'webinar'];
  const eventStatuses = ['upcoming', 'past'];

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = event.status === filterStatus;
    return matchesType && matchesStatus;
  });

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
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Events & Notices
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Join our academic community through conferences, workshops, lectures, and seminars. 
            Stay connected with the latest developments in international law and governance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {eventStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Events
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      {event.isVirtual && (
                        <Badge variant="outline">Virtual</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl md:text-2xl leading-tight">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0">
                    {/* Event Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.registered || 0} / {event.capacity} registered</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="academic-text mb-4">
                      {event.description}
                    </p>

                    {/* Speakers */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Speakers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((speaker, index) => (
                          <Badge key={index} variant="secondary">
                            {speaker}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {event.status === 'upcoming' && event.registrationUrl && (
                        <Button asChild>
                          <a href={event.registrationUrl} className="flex items-center space-x-2">
                            <span>Register Now</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Share Event
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="academic-heading text-xl mb-4">No events found</h3>
            <p className="academic-text mb-6">
              There are no {filterStatus} events matching your current filters.
            </p>
            <Button onClick={() => { setFilterType('all'); setFilterStatus('upcoming'); }}>
              View All Upcoming Events
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-muted/30 rounded-lg p-12">
          <h2 className="academic-heading text-3xl mb-4">Stay Updated</h2>
          <p className="academic-text text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive notifications about upcoming events, 
            conferences, and academic opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Subscribe to Newsletter
            </Button>
            <Button variant="outline" size="lg">
              View Past Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;