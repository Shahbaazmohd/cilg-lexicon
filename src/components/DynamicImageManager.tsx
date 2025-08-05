import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, X, Trash2, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DynamicImageService, DynamicImage } from '@/lib/dynamicImageService';

const DynamicImageManager = () => {
  const [images, setImages] = useState<DynamicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const allImages = await DynamicImageService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, position: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
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
      // Upload image to storage
      const imageUrl = await DynamicImageService.uploadImage(file, position);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Update database with new image URL
      const success = await DynamicImageService.updateImageUrl(position, imageUrl);
      
      if (success) {
        // Reload images to get updated data
        await loadImages();
        toast({
          title: "Success!",
          description: `${images.find(img => img.position === position)?.display_name} updated successfully`,
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

  const handleDeleteImage = async (position: string) => {
    try {
      const success = await DynamicImageService.deleteImage(position);
      
      if (success) {
        await loadImages();
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

  const getImageUrl = (image: DynamicImage): string => {
    return image.image_url || DynamicImageService.getFallbackImage(image.position);
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
          <h2 className="text-2xl font-bold">Dynamic Image Management</h2>
          <p className="text-muted-foreground">
            Manage images displayed across different pages. Images are categorized by their location on the website.
          </p>
        </div>
        <Button
          onClick={loadImages}
          variant="outline"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-8">
        {(() => {
          // Group images by page category
          const groupedImages = images.reduce((acc, image) => {
            const category = getPageCategory(image.position);
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(image);
            return acc;
          }, {} as Record<string, typeof images>);

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
                                onClick={() => handleDeleteImage(image.position)}
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
                      {/* Current Image Preview */}
                      <div>
                        <h4 className="font-medium mb-3">Current Image</h4>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                          <img
                            src={getImageUrl(image)}
                            alt={image.display_name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="bg-white/90 rounded-lg p-2">
                              <ImageIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upload Section */}
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
                            onChange={(e) => handleImageUpload(e, image.position)}
                            disabled={uploadingStates[image.position]}
                            className="hidden"
                            id={`image-upload-${image.position}`}
                          />
                          <label htmlFor={`image-upload-${image.position}`}>
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

                      {/* Guidelines */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Guidelines</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Recommended size: 1920x1080 pixels or larger</li>
                          <li>• Supported formats: JPG, PNG, WebP</li>
                          <li>• Maximum file size: 5MB</li>
                          <li>• Image should be high quality and relevant to the section</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default DynamicImageManager; 