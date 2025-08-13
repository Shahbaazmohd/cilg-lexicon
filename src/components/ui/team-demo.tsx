import { Mail, ExternalLink, BookOpen, Award, Linkedin, Twitter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember, TeamService } from '@/lib/teamService';
import { useEffect, useState } from 'react';

interface TeamDemoProps {
  className?: string;
}

export default function TeamDemo({ className = "" }: TeamDemoProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExpertise, setExpandedExpertise] = useState<Set<string>>(new Set());

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
      title: 'Patrons', 
      key: 'patrons',
      members: teamMembers.filter(m => m.category === 'patrons') 
    },
    { 
      title: 'Faculty', 
      key: 'faculty',
      members: teamMembers.filter(m => m.category === 'faculty') 
    },
    { 
      title: 'Convenor', 
      key: 'convenor',
      members: teamMembers.filter(m => m.category === 'convenor') 
    },
    { 
      title: 'Core Team', 
      key: 'core-team',
      members: teamMembers.filter(m => m.category === 'core-team') 
    },
    { 
      title: 'Team Heads', 
      key: 'team-heads',
      members: teamMembers.filter(m => m.category === 'team-heads') 
    },
    { 
      title: 'Members', 
      key: 'members',
      members: teamMembers.filter(m => m.category === 'members') 
    },
    { 
      title: 'Past Contributors', 
      key: 'past-contributors',
      members: teamMembers.filter(m => m.category === 'past-contributors') 
    },
    { 
      title: 'Developers', 
      key: 'developers',
      members: teamMembers.filter(m => m.category === 'developers') 
    },
  ];

  if (loading) {
    return (
      <section className={`bg-gray-50 py-16 md:py-32 dark:bg-transparent ${className}`}>
        <div className="mx-auto max-w-5xl border-t px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-12"></div>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-96 w-full bg-gray-200 rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 py-4 md:py-8 dark:bg-transparent ${className}`}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-4 gap-4 sm:grid sm:grid-cols-2 md:mt-8">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl academic-heading">Our Academic Team</h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p className="academic-text">Our diverse team of scholars, researchers, and practitioners brings together expertise from across the spectrum of international law and governance.</p>
          </div>
        </div>
        
        {categories.map((category) => (
          category.members.length > 0 && (
            <div key={category.key} className="mt-12 md:mt-24">
              <h3 className="text-2xl font-semibold mb-8 academic-heading">{category.title}</h3>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {category.members.map((member, index) => (
                  <div key={member.id} className="group overflow-hidden">
                    <div className="relative h-96 w-full rounded-md overflow-hidden">
                      <img 
                        className="h-full w-full object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                        src={TeamService.getImageUrlWithFallback(member.image_url)} 
                        alt={member.name} 
                        width="826" 
                        height="1239" 
                      />
                      {!member.image_url && (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <User className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                      <div className="flex justify-between">
                        <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider academic-text">{member.name}</h3>
                        <span className="text-xs text-muted-foreground">_{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                        {member.email && (
                          <Button 
                            asChild 
                            variant="ghost" 
                            size="sm"
                            className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <a href={`mailto:${member.email}`}>
                              Contact
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {/* Additional member details */}
                      {member.bio && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {member.bio}
                        </p>
                      )}
                      
                      {/* Expertise badges */}
                      {member.expertise && member.expertise.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {member.expertise.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {expandedExpertise.has(member.id) && member.expertise.slice(2).map((skill, idx) => (
                            <Badge key={idx + 2} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 2 && !expandedExpertise.has(member.id) && (
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                setExpandedExpertise(prev => new Set([...prev, member.id]));
                              }}
                              title={`Click to see all expertise: ${member.expertise.join(', ')}`}
                            >
                              +{member.expertise.length - 2}
                            </Badge>
                          )}
                          {expandedExpertise.has(member.id) && member.expertise.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-muted transition-colors"
                              onClick={() => {
                                setExpandedExpertise(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(member.id);
                                  return newSet;
                                });
                              }}
                              title="Click to hide additional expertise"
                            >
                              -{member.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
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