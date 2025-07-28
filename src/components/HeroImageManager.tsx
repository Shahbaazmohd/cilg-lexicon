import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SettingsService } from '@/lib/settingsService';

const HeroImageManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load current hero image on component mount
  useEffect(() => {
    loadCurrentHeroImage();
  }, []);

  const loadCurrentHeroImage = async () => {
    try {
      const heroImageUrl = await SettingsService.getHeroImageUrl();
      setCurrentImage(heroImageUrl);
    } catch (error) {
      console.error('Error loading hero image:', error);
      setCurrentImage('/src/assets/hero-image.jpg');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-image-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('lovable-uploads')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(fileName);

      // Save the URL to settings
      const success = await SettingsService.setHeroImageUrl(publicUrl);
      
      if (success) {
        setCurrentImage(publicUrl);
        toast({
          title: "Success!",
          description: "Hero image updated successfully for all users",
        });
      } else {
        throw new Error('Failed to save image URL');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetToDefault = async () => {
    try {
      const success = await SettingsService.setHeroImageUrl('/src/assets/hero-image.jpg');
      if (success) {
        setCurrentImage('/src/assets/hero-image.jpg');
        toast({
          title: "Reset successful",
          description: "Hero image reset to default for all users",
        });
      } else {
        throw new Error('Failed to reset image');
      }
    } catch (error) {
      console.error('Error resetting image:', error);
      toast({
        title: "Reset failed",
        description: "Failed to reset hero image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const currentHeroImage = currentImage || '/src/assets/hero-image.jpg';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>Hero Image Management</span>
        </CardTitle>
        <CardDescription>
          Upload and manage the hero image displayed on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Image Preview */}
        <div>
          <h4 className="font-medium mb-3">Current Hero Image</h4>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
            <img
              src={currentHeroImage}
              alt="Current hero image"
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
        <div className="space-y-4">
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
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
                id="hero-image-upload"
              />
              <label htmlFor="hero-image-upload">
                <Button 
                  disabled={isUploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    {isUploading ? (
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

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(currentHeroImage, '_blank')}
              className="flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              View Full Size
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Recommended size: 1920x1080 pixels or larger</li>
            <li>• Supported formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Image should be high quality and relevant to your organization</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroImageManager; 