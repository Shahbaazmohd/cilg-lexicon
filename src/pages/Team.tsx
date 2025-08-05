import { Mail, ExternalLink, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TeamSection from '@/components/ui/team';
import TeamDemo from '@/components/ui/team-demo';
import { TeamMember, TeamService } from '@/lib/teamService';
import { useEffect, useState } from 'react';

const Team = () => {
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
    { title: 'Core Team', members: teamMembers.filter(m => m.category === 'core-team') },
    { title: 'Social Media Team', members: teamMembers.filter(m => m.category === 'social-media-team') },
    { title: 'Research & Editorial Team', members: teamMembers.filter(m => m.category === 'research-editorial-team') },
    { title: 'Events Team', members: teamMembers.filter(m => m.category === 'events-team') },
    { title: 'Mentors', members: teamMembers.filter(m => m.category === 'mentors') },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="academic-container py-12">
        <div className="text-center mb-16">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Meet Our Team
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Our diverse team of scholars, researchers, and practitioners brings together 
            expertise from across the spectrum of international law and governance.
          </p>
        </div>
      </div>

      {/* Team Section - Simple Layout */}
      <TeamSection />

      {/* Team Section - Detailed Layout */}
      <TeamDemo />

      {/* Detailed Team Cards (if you want to keep the original detailed cards) */}
      {teamMembers.length > 0 && (
        <div className="academic-container py-12">
          {categories.map((category) => (
            category.members.length > 0 && (
              <div key={category.title} className="mb-16">
                <h2 className="academic-heading text-2xl mb-8 text-center">
                  {category.title}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.members.map((member) => (
                    <Card key={member.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={TeamService.getImageUrlWithFallback(member.image_url)}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="font-medium text-primary">{member.role}</div>
                          <div>{member.position}</div>
                          {member.department && (
                            <div className="text-sm">{member.department}</div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Bio */}
                        {member.bio && (
                          <p className="academic-text text-sm mb-4 line-clamp-4">
                            {member.bio}
                          </p>
                        )}

                        {/* Expertise */}
                        {member.expertise && member.expertise.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2">Expertise:</h4>
                            <div className="flex flex-wrap gap-1">
                              {member.expertise.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.expertise.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          {member.publications && (
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{member.publications} publications</span>
                            </div>
                          )}
                          {member.awards && member.awards.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{member.awards.length} awards</span>
                            </div>
                          )}
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                          {member.email && (
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a href={`mailto:${member.email}`} className="flex items-center justify-center space-x-2">
                                <Mail className="h-3 w-3" />
                                <span>Contact</span>
                              </a>
                            </Button>
                          )}
                          
                          {member.social_links && (
                            <div className="flex gap-1">
                              {member.social_links.linkedin && (
                                <Button asChild variant="ghost" size="sm" className="flex-1">
                                  <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                  </a>
                                </Button>
                              )}
                              {member.social_links.orcid && (
                                <Button asChild variant="ghost" size="sm" className="flex-1">
                                  <a href={member.social_links.orcid} target="_blank" rel="noopener noreferrer">
                                    ORCID
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Join Our Team */}
      <div className="academic-container py-12">
        <div className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="academic-heading text-3xl mb-4">Join Our Team</h2>
          <p className="academic-text text-lg mb-8 max-w-2xl mx-auto">
            We are always looking for talented researchers, visiting scholars, and students 
            interested in contributing to our work in international law and governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              View Open Positions
            </Button>
            <Button variant="outline" size="lg">
              Visiting Scholars Program
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;