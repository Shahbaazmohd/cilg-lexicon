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

interface TeamMemberManagerProps {
  className?: string;
}

export default function TeamMemberManager({ className = "" }: TeamMemberManagerProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
    category: 'core-team' as 'core-team' | 'social-media-team' | 'research-editorial-team' | 'events-team' | 'mentors',
    is_active: true,
    social_links: {
      linkedin: '',
      twitter: '',
      orcid: '',
      googleScholar: ''
    }
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
    
    try {
      // Here you would typically save to Supabase
      // For now, we'll just update the local state
      const newMember: TeamMember = {
        id: editingMember?.id || `temp-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMember) {
        // Update existing member
        setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? newMember : m));
      } else {
        // Add new member
        setTeamMembers(prev => [...prev, newMember]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
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
      category: 'core-team',
      is_active: true,
      social_links: {
        linkedin: '',
        twitter: '',
        orcid: '',
        googleScholar: ''
      }
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
      category: member.category,
      is_active: member.is_active,
      social_links: member.social_links || {
        linkedin: '',
        twitter: '',
        orcid: '',
        googleScholar: ''
      }
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
                    onValueChange={(value: 'core-team' | 'social-media-team' | 'research-editorial-team' | 'events-team' | 'mentors') => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core-team">Core Team</SelectItem>
                      <SelectItem value="social-media-team">Social Media Team</SelectItem>
                      <SelectItem value="research-editorial-team">Research & Editorial Team</SelectItem>
                      <SelectItem value="events-team">Events Team</SelectItem>
                      <SelectItem value="mentors">Mentors</SelectItem>
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="grid gap-4">
        {teamMembers.map((member) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No team members found.</p>
        </div>
      )}
    </div>
  );
} 