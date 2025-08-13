import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TeamMember, TeamService } from '@/lib/teamService';
import { Plus, Edit, Trash2, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMemberManagerProps {
  className?: string;
}

export default function TeamMemberManager({ className = "" }: TeamMemberManagerProps) {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    position: '',
    department: '',
    email: '',
    bio: '',
    expertise: [] as string[],
    education: [] as string[],
    publications: 0,
    awards: [] as string[],
    image_url: '',
    social_links: {
      linkedin: '',
      twitter: '',
      orcid: '',
      googleScholar: ''
    },
    category: 'patrons' as 'patrons' | 'faculty' | 'convenor' | 'core-team' | 'team-heads' | 'members' | 'past-contributors' | 'developers',
    is_active: true
  });

  const [expertiseInput, setExpertiseInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  const [awardsInput, setAwardsInput] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

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

  const handleImageUpload = async (file: File, memberId: string) => {
    try {
      const imageUrl = await TeamService.uploadTeamMemberImage(file, memberId);
      if (imageUrl) {
        await TeamService.updateTeamMemberImageUrl(memberId, imageUrl);
        fetchTeamMembers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Form submitted!');
    console.log('Form event:', e);
    console.log('Current editingMember:', editingMember);
    console.log('Current formData:', formData);
    
    try {
      if (editingMember) {
        // Update existing member
        console.log('🔄 Updating member:', editingMember.id);
        console.log('📝 Update data:', formData);
        
        const updatedMember = await TeamService.updateTeamMember(editingMember.id, formData);
        console.log('📊 Update result:', updatedMember);
        
        if (updatedMember) {
          console.log('✅ Update successful, updating local state...');
          console.log('📊 Before state update - Current team members:', teamMembers);
          console.log('📊 Updated member data:', updatedMember);
          
          setTeamMembers(prev => {
            const newState = prev.map(m => m.id === editingMember.id ? updatedMember : m);
            console.log('📊 After state update - New team members:', newState);
            return newState;
          });
          
          // Also refresh from server to ensure consistency
          console.log('🔄 Refreshing team members from server...');
          await fetchTeamMembers();
          
          toast({
            title: "Success",
            description: "Team member updated successfully!",
          });
          resetForm();
        } else {
          console.error('❌ Failed to update member - no result returned');
          toast({
            title: "Error",
            description: "Failed to update team member. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        // Add new member
        console.log('🔄 Creating new member...');
        console.log('📝 Create data:', formData);
        
        const newMember = await TeamService.createTeamMember(formData);
        if (newMember) {
          console.log('✅ Create successful, updating local state...');
          setTeamMembers(prev => [...prev, newMember]);
          toast({
            title: "Success",
            description: "Team member added successfully!",
          });
          resetForm();
        } else {
          console.error('❌ Failed to create team member - no result returned');
          toast({
            title: "Error",
            description: "Failed to create team member. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast({
        title: "Error",
        description: "An error occurred while saving the team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      position: '',
      department: '',
      email: '',
      bio: '',
      expertise: [],
      education: [],
      publications: 0,
      awards: [],
      image_url: '',
      social_links: {
        linkedin: '',
        twitter: '',
        orcid: '',
        googleScholar: ''
      },
      category: 'patrons',
      is_active: true
    });
    setEditingMember(null);
    setIsAdding(false);
    setExpertiseInput('');
    setEducationInput('');
    setAwardsInput('');
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      position: member.position || '',
      department: member.department || '',
      email: member.email || '',
      bio: member.bio || '',
      expertise: member.expertise || [],
      education: member.education || [],
      publications: member.publications || 0,
      awards: member.awards || [],
      image_url: member.image_url || '',
      social_links: member.social_links || {
        linkedin: '',
        twitter: '',
        orcid: '',
        googleScholar: ''
      },
      category: member.category,
      is_active: member.is_active
    });
    setIsAdding(true);
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (educationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, educationInput.trim()]
      }));
      setEducationInput('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    if (awardsInput.trim()) {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, awardsInput.trim()]
      }));
      setAwardsInput('');
    }
  };

  const removeAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };



  const handleDelete = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const success = await TeamService.deleteTeamMember(memberId);
        if (success) {
          setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading team members...</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
            <CardDescription>
              {editingMember ? 'Update team member information' : 'Add a new team member to the organization'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'patrons' | 'faculty' | 'convenor' | 'core-team' | 'team-heads' | 'members' | 'past-contributors' | 'developers') => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patrons">Patrons</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="convenor">Convenor</SelectItem>
                      <SelectItem value="core-team">Core Team</SelectItem>
                      <SelectItem value="team-heads">Team Heads</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="past-contributors">Past Contributors</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Expertise */}
              <div>
                <Label>Expertise</Label>
                <div className="flex gap-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Add expertise area"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  />
                  <Button type="button" onClick={addExpertise}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.expertise.map((exp, index) => (
                    <Badge key={index} variant="secondary">
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <Label>Education</Label>
                <div className="flex gap-2">
                  <Input
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    placeholder="Add education degree/institution"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                  />
                  <Button type="button" onClick={addEducation}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.education.map((edu, index) => (
                    <Badge key={index} variant="secondary">
                      {edu}
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div>
                <Label>Awards</Label>
                <div className="flex gap-2">
                  <Input
                    value={awardsInput}
                    onChange={(e) => setAwardsInput(e.target.value)}
                    placeholder="Add award/recognition"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
                  />
                  <Button type="button" onClick={addAward}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.awards.map((award, index) => (
                    <Badge key={index} variant="secondary">
                      {award}
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.social_links.linkedin}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_links: { ...prev.social_links, linkedin: e.target.value }
                    }))}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={formData.social_links.twitter}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_links: { ...prev.social_links, twitter: e.target.value }
                    }))}
                    placeholder="Twitter/X profile URL"
                  />
                </div>
                <div>
                  <Label htmlFor="orcid">ORCID</Label>
                  <Input
                    id="orcid"
                    value={formData.social_links.orcid}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_links: { ...prev.social_links, orcid: e.target.value }
                    }))}
                    placeholder="ORCID ID"
                  />
                </div>
                <div>
                  <Label htmlFor="googleScholar">Google Scholar</Label>
                  <Input
                    id="googleScholar"
                    value={formData.social_links.googleScholar}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_links: { ...prev.social_links, googleScholar: e.target.value }
                    }))}
                    placeholder="Google Scholar profile URL"
                  />
                </div>
              </div>

              {/* Publications */}
              <div>
                <Label htmlFor="publications">Publications</Label>
                <Input
                  id="publications"
                  type="number"
                  value={formData.publications}
                  onChange={(e) => setFormData(prev => ({ ...prev, publications: parseInt(e.target.value) || 0 }))}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                {editingMember && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      console.log('🧪 Test button clicked!');
                      console.log('Current editingMember:', editingMember);
                      console.log('Current formData:', formData);
                      // Manually trigger the update for testing
                      handleSubmit(new Event('submit') as any);
                    }}
                  >
                    🧪 Test Update
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-4">
        <Label htmlFor="category-filter">Filter by Category:</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="patrons">Patrons</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="convenor">Convenor</SelectItem>
            <SelectItem value="core-team">Core Team</SelectItem>
            <SelectItem value="team-heads">Team Heads</SelectItem>
            <SelectItem value="members">Members</SelectItem>
            <SelectItem value="past-contributors">Past Contributors</SelectItem>
            <SelectItem value="developers">Developers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Members List */}
      <div className="grid gap-4">
        {teamMembers
          .filter(member => categoryFilter === 'all' || member.category === categoryFilter)
          .map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer">
                    <Upload className="h-3 w-3" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, member.id);
                        }
                      }}
                    />
                  </label>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{member.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.position && (
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Quick Category Change */}
                  <Select
                    value={member.category}
                    onValueChange={async (newCategory: 'patrons' | 'faculty' | 'convenor' | 'core-team' | 'team-heads' | 'members' | 'past-contributors' | 'developers') => {
                      try {
                        const updatedMember = await TeamService.updateTeamMember(member.id, { ...member, category: newCategory });
                        if (updatedMember) {
                          setTeamMembers(prev => prev.map(m => m.id === member.id ? updatedMember : m));
                          toast({
                            title: "Success",
                            description: `Member moved to ${newCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} category`,
                          });
                        } else {
                          toast({
                            title: "Error",
                            description: "Failed to update category. Please try again.",
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error('Error updating category:', error);
                        toast({
                          title: "Error",
                          description: "Failed to update category. Please try again.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patrons">Patrons</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="convenor">Convenor</SelectItem>
                      <SelectItem value="core-team">Core Team</SelectItem>
                      <SelectItem value="team-heads">Team Heads</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="past-contributors">Past Contributors</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.filter(member => categoryFilter === 'all' || member.category === categoryFilter).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {categoryFilter === 'all' 
              ? 'No team members found.' 
              : `No team members found in the "${categoryFilter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}" category.`
            }
          </p>
        </div>
      )}
    </div>
  );
} 