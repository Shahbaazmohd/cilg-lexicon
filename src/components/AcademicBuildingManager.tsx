import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SettingsService } from '@/lib/settingsService';
import academicBuilding from '@/assets/academic-building.jpg';

const AcademicBuildingManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load current academic building image on component mount
  useEffect(() => {
    loadCurrentImage();
  }, []);

  const loadCurrentImage = async () => {
    try {
      const buildingUrl = await SettingsService.getSetting('academic_building_url');
      setCurrentImage(buildingUrl || academicBuilding);
    } catch (error) {
      console.error('Error loading academic building image:', error);
      setCurrentImage(academicBuilding);
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
      const fileName = `academic-building-${Date.now()}.${fileExt}`;

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
      const success = await SettingsService.setSetting('academic_building_url', publicUrl);
      
      if (success) {
        setCurrentImage(publicUrl);
        toast({
          title: "Success!",
          description: "Academic building image updated successfully for all users",
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
      const success = await SettingsService.setSetting('academic_building_url', academicBuilding);
      if (success) {
        setCurrentImage(academicBuilding);
        toast({
          title: "Reset successful",
          description: "Academic building image reset to default for all users",
        });
      } else {
        throw new Error('Failed to reset image');
      }
    } catch (error) {
      console.error('Error resetting image:', error);
      toast({
        title: "Reset failed",
        description: "Failed to reset academic building image. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Building Image Manager</CardTitle>
          <CardDescription>Manage the building image shown on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Academic Building Image Manager
        </CardTitle>
        <CardDescription>
          Manage the building image shown on the homepage and research areas sections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Image Preview */}
        <div>
          <h3 className="font-semibold mb-3">Current Image</h3>
          <div className="relative">
            <img
              src={currentImage || academicBuilding}
              alt="Current Academic Building"
              className="w-full h-48 object-cover rounded-lg border"
            />
            {currentImage && currentImage !== academicBuilding && (
              <Button
                onClick={resetToDefault}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <h3 className="font-semibold mb-3">Upload New Image</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById('academic-building-upload')?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </>
                )}
              </Button>
              <input
                id="academic-building-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                JPG, PNG, WebP up to 5MB
              </span>
            </div>
            
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Uploading and optimizing image...
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Image Guidelines</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Recommended size: 800x600 pixels or larger</li>
            <li>• Format: JPG, PNG, or WebP</li>
            <li>• File size: Maximum 5MB</li>
            <li>• The image will be automatically optimized</li>
            <li>• Changes will be visible to all website visitors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicBuildingManager; 