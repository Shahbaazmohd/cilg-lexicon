import { Mail, ExternalLink, BookOpen, Award, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TeamMember, TeamService } from '@/lib/teamService';
import { useEffect, useState } from 'react';

interface TeamSectionProps {
  className?: string;
}

export default function TeamSection({ className = "" }: TeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await TeamService.getAllTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const categories = [
    { 
      title: 'Core Team', 
      key: 'core-team',
      members: teamMembers.filter(m => m.category === 'core-team') 
    },
    { 
      title: 'Social Media Team', 
      key: 'social-media-team',
      members: teamMembers.filter(m => m.category === 'social-media-team') 
    },
    { 
      title: 'Research & Editorial Team', 
      key: 'research-editorial-team',
      members: teamMembers.filter(m => m.category === 'research-editorial-team') 
    },
    { 
      title: 'Events Team', 
      key: 'events-team',
      members: teamMembers.filter(m => m.category === 'events-team') 
    },
    { 
      title: 'Mentors', 
      key: 'mentors',
      members: teamMembers.filter(m => m.category === 'mentors') 
    },
  ];

  if (loading) {
    return (
      <section className={`py-12 md:py-32 ${className}`}>
        <div className="mx-auto max-w-3xl px-8 lg:px-0">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 md:py-32 ${className}`}>
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl academic-heading">Our Team</h2>

        {categories.map((category) => (
          category.members.length > 0 && (
            <div key={category.key} className="mb-8">
              <h3 className="mb-6 text-lg font-medium academic-text">{category.title}</h3>
              <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                {category.members.map((member) => (
                  <div key={member.id} className="text-center group">
                    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5 mx-auto group-hover:shadow-lg transition-shadow duration-300">
                      <img 
                        className="aspect-square rounded-full object-cover" 
                        src={TeamService.getImageUrlWithFallback(member.image_url)} 
                        alt={member.name} 
                        height="460" 
                        width="460" 
                        loading="lazy" 
                      />
                    </div>
                    <span className="mt-2 block text-sm font-medium academic-text">{member.name}</span>
                    <span className="text-muted-foreground block text-xs">{member.role}</span>
                    {member.position && (
                      <span className="text-muted-foreground block text-xs">{member.position}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No team members found.</p>
          </div>
        )}
      </div>
    </section>
  );
} 