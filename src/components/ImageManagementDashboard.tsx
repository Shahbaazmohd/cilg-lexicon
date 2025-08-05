import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, X, Trash2, Eye, Settings, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DynamicImageService, DynamicImage } from '@/lib/dynamicImageService';
import { TeamService, TeamMember } from '@/lib/teamService';

const ImageManagementDashboard = () => {
  const [dynamicImages, setDynamicImages] = useState<DynamicImage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [images, members] = await Promise.all([
        DynamicImageService.getAllImages(),
        TeamService.getAllTeamMembers()
      ]);
      setDynamicImages(images);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load image data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, position: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingStates(prev => ({ ...prev, [position]: true }));

    try {
      const imageUrl = await DynamicImageService.uploadImage(file, position);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const success = await DynamicImageService.updateImageUrl(position, imageUrl);
      
      if (success) {
        await loadAllData();
        toast({
          title: "Success!",
          description: "Image updated successfully",
        });
      } else {
        throw new Error('Failed to update image URL');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingStates(prev => ({ ...prev, [position]: false }));
    }
  };

  const handleTeamImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingStates(prev => ({ ...prev, [memberId]: true }));

    try {
      const imageUrl = await TeamService.uploadTeamMemberImage(file, memberId);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const success = await TeamService.updateTeamMemberImageUrl(memberId, imageUrl);
      
      if (success) {
        await loadAllData();
        toast({
          title: "Success!",
          description: "Team member image updated successfully",
        });
      } else {
        throw new Error('Failed to update image URL');
      }

    } catch (error) {
      console.error('Error uploading team image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload team member image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingStates(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const handleDeleteImage = async (position: string, type: 'dynamic' | 'team') => {
    try {
      let success = false;
      
      if (type === 'dynamic') {
        success = await DynamicImageService.deleteImage(position);
      } else {
        // For team members, we'll just clear the image URL
        success = await TeamService.updateTeamMemberImageUrl(position, '');
      }
      
      if (success) {
        await loadAllData();
        toast({
          title: "Success!",
          description: "Image deleted successfully",
        });
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPageCategory = (position: string): string => {
    const pageCategories: Record<string, string> = {
      'hero': 'Home Page',
      'about': 'Home Page',
      'about-story': 'About Page',
      'research-area-1': 'Home Page',
      'research-area-2': 'Home Page',
      'research-area-3': 'Home Page',
    };
    return pageCategories[position] || 'Other Pages';
  };

  const getPositionDescription = (position: string): string => {
    const descriptions: Record<string, string> = {
      'hero': 'Main hero image at the top of the homepage',
      'about': 'Image in the about section',
      'about-story': 'Image in the Our Story section of the About page',
      'research-area-1': 'International Criminal Law section',
      'research-area-2': 'Human Rights Law section',
      'research-area-3': 'Conflict Resolution section',
    };
    return descriptions[position] || 'Unknown position';
  };

  const getDynamicImageUrl = (image: DynamicImage): string => {
    return image.image_url || DynamicImageService.getFallbackImage(image.position);
  };

  const getTeamImageUrl = (member: TeamMember): string => {
    return TeamService.getImageUrlWithFallback(member.image_url);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="border-b pb-2">
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Image Management Dashboard</h2>
          <p className="text-muted-foreground">
            Manage all images across the website including dynamic page images and team member photos.
          </p>
        </div>
        <Button
          onClick={loadAllData}
          variant="outline"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="dynamic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dynamic" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Page Images</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team Photos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dynamic" className="space-y-6">
          <div className="space-y-8">
            {(() => {
              const groupedImages = dynamicImages.reduce((acc, image) => {
                const category = getPageCategory(image.position);
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(image);
                return acc;
              }, {} as Record<string, typeof dynamicImages>);

              return Object.entries(groupedImages).map(([category, categoryImages]) => (
                <div key={category} className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryImages.length} image{categoryImages.length !== 1 ? 's' : ''} on this page
                    </p>
                  </div>
                  <div className="grid gap-6">
                    {categoryImages.map((image) => (
                      <Card key={image.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center space-x-2">
                                <ImageIcon className="h-5 w-5" />
                                <span>{image.display_name}</span>
                                {image.image_url && (
                                  <Badge variant="secondary" className="ml-2">
                                    Custom
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {getPositionDescription(image.position)}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              {image.image_url && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(image.image_url!, '_blank')}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteImage(image.position, 'dynamic')}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-3">Current Image</h4>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                              <img
                                src={getDynamicImageUrl(image)}
                                alt={image.display_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Upload New Image</h4>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-3">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mb-4">
                                PNG, JPG up to 5MB
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleDynamicImageUpload(e, image.position)}
                                disabled={uploadingStates[image.position]}
                                className="hidden"
                                id={`dynamic-image-upload-${image.position}`}
                              />
                              <label htmlFor={`dynamic-image-upload-${image.position}`}>
                                <Button 
                                  disabled={uploadingStates[image.position]}
                                  className="cursor-pointer"
                                  asChild
                                >
                                  <span>
                                    {uploadingStates[image.position] ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choose Image
                                      </>
                                    )}
                                  </span>
                                </Button>
                              </label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-xl font-semibold text-foreground">Team Member Photos</h3>
              <p className="text-sm text-muted-foreground">
                {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <div className="grid gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>{member.name}</span>
                          <Badge variant="outline">{TeamService.getCategoryDisplayName(member.category)}</Badge>
                          {member.image_url && (
                            <Badge variant="secondary">
                              Custom Photo
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {member.role} • {member.position}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {member.image_url && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(member.image_url!, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(member.id, 'team')}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Current Photo</h4>
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border border-border mx-auto">
                        <img
                          src={getTeamImageUrl(member)}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Upload New Photo</h4>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Click to upload a profile photo
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          PNG, JPG up to 5MB • Square format recommended
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleTeamImageUpload(e, member.id)}
                          disabled={uploadingStates[member.id]}
                          className="hidden"
                          id={`team-image-upload-${member.id}`}
                        />
                        <label htmlFor={`team-image-upload-${member.id}`}>
                          <Button 
                            disabled={uploadingStates[member.id]}
                            className="cursor-pointer"
                            asChild
                          >
                            <span>
                              {uploadingStates[member.id] ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose Photo
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageManagementDashboard; 