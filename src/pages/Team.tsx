import { Mail, ExternalLink, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  position: string;
  department?: string;
  email: string;
  bio: string;
  expertise: string[];
  education: string[];
  publications: number;
  awards?: string[];
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    orcid?: string;
    googleScholar?: string;
  };
}

const Team = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Prof. Sarah Johnson',
      title: 'Director',
      position: 'Professor of International Law',
      department: 'Faculty of Law',
      email: 's.johnson@university.edu',
      bio: 'Prof. Johnson is a leading expert in international criminal law with over 20 years of experience in academia and practice. She previously served as a legal advisor to the International Criminal Court and has authored numerous publications on transitional justice.',
      expertise: ['International Criminal Law', 'Transitional Justice', 'Human Rights', 'International Courts'],
      education: ['Ph.D. International Law, Harvard University', 'LL.M. Cambridge University', 'LL.B. Oxford University'],
      publications: 45,
      awards: ['Outstanding Scholar Award 2022', 'International Law Association Prize'],
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        orcid: 'https://orcid.org/0000-0000-0000-0000'
      }
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Associate Director',
      position: 'Associate Professor',
      department: 'Faculty of Law',
      email: 'm.chen@university.edu',
      bio: 'Dr. Chen specializes in environmental law and climate governance. His research focuses on the intersection of international environmental law and economic development, with particular emphasis on climate change adaptation strategies.',
      expertise: ['Environmental Law', 'Climate Governance', 'Sustainable Development', 'International Trade'],
      education: ['Ph.D. Environmental Law, Yale University', 'LL.M. International Environmental Law, University of Edinburgh'],
      publications: 32,
      awards: ['Early Career Researcher Award'],
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      socialLinks: {
        twitter: 'https://twitter.com/michael_chen_law',
        googleScholar: 'https://scholar.google.com/citations?user=example'
      }
    },
    {
      id: '3',
      name: 'Dr. Emma Rodriguez',
      title: 'Senior Research Fellow',
      position: 'Senior Lecturer',
      email: 'e.rodriguez@university.edu',
      bio: 'Dr. Rodriguez is an expert in digital rights and technology law. Her work examines the legal challenges posed by artificial intelligence, data governance, and cybersecurity in international contexts.',
      expertise: ['Digital Rights', 'Technology Law', 'Data Protection', 'Cybersecurity Law'],
      education: ['Ph.D. Information Technology Law, Stanford University', 'LL.M. Intellectual Property Law, NYU'],
      publications: 28,
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emma-rodriguez',
        orcid: 'https://orcid.org/0000-0000-0000-0001'
      }
    },
    {
      id: '4',
      name: 'Prof. David Kim',
      title: 'Research Professor',
      position: 'Professor of International Economics',
      department: 'Faculty of Economics',
      email: 'd.kim@university.edu',
      bio: 'Prof. Kim brings expertise in international economic law and trade policy. His interdisciplinary approach combines legal analysis with economic theory to examine global trade governance mechanisms.',
      expertise: ['International Trade Law', 'Economic Sanctions', 'WTO Law', 'Investment Arbitration'],
      education: ['Ph.D. Economics, MIT', 'LL.M. International Trade Law, Georgetown University'],
      publications: 38,
      awards: ['Excellence in Research Award', 'Trade Law Society Recognition'],
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png'
    },
    {
      id: '5',
      name: 'Dr. Aisha Patel',
      title: 'Research Fellow',
      position: 'Lecturer',
      email: 'a.patel@university.edu',
      bio: 'Dr. Patel focuses on refugee law and forced migration. Her research examines the international legal framework for refugee protection and the challenges of contemporary displacement.',
      expertise: ['Refugee Law', 'Migration Law', 'International Protection', 'Human Security'],
      education: ['Ph.D. Refugee Studies, University of Oxford', 'LL.M. International Humanitarian Law, Geneva Academy'],
      publications: 15,
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png'
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Research Assistant',
      position: 'Ph.D. Candidate',
      email: 'j.wilson@university.edu',
      bio: 'James is a doctoral candidate researching international dispute resolution mechanisms. His dissertation focuses on the role of regional courts in global governance.',
      expertise: ['International Dispute Resolution', 'Regional Courts', 'Judicial Decision-Making'],
      education: ['LL.M. International Law, University of Cambridge', 'LL.B. International Law, King\'s College London'],
      publications: 5,
      image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png'
    }
  ];

  const categories = [
    { title: 'Leadership', members: teamMembers.filter(m => m.title.includes('Director')) },
    { title: 'Faculty', members: teamMembers.filter(m => m.title.includes('Professor') || m.title.includes('Fellow')) },
    { title: 'Research Staff', members: teamMembers.filter(m => m.title.includes('Assistant') || m.title.includes('Candidate')) },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Meet Our Team
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Our diverse team of scholars, researchers, and practitioners brings together 
            expertise from across the spectrum of international law and governance.
          </p>
        </div>

        {/* Team Categories */}
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
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="font-medium text-primary">{member.title}</div>
                        <div>{member.position}</div>
                        {member.department && (
                          <div className="text-sm">{member.department}</div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Bio */}
                      <p className="academic-text text-sm mb-4 line-clamp-4">
                        {member.bio}
                      </p>

                      {/* Expertise */}
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

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{member.publications} publications</span>
                        </div>
                        {member.awards && (
                          <div className="flex items-center space-x-1">
                            <Award className="h-3 w-3" />
                            <span>{member.awards.length} awards</span>
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div className="space-y-2">
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <a href={`mailto:${member.email}`} className="flex items-center justify-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span>Contact</span>
                          </a>
                        </Button>
                        
                        {member.socialLinks && (
                          <div className="flex gap-1">
                            {member.socialLinks.linkedin && (
                              <Button asChild variant="ghost" size="sm" className="flex-1">
                                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                  LinkedIn
                                </a>
                              </Button>
                            )}
                            {member.socialLinks.orcid && (
                              <Button asChild variant="ghost" size="sm" className="flex-1">
                                <a href={member.socialLinks.orcid} target="_blank" rel="noopener noreferrer">
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

        {/* Join Our Team */}
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