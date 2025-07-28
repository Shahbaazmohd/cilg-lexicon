import React, { useState } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface HeroImageUploaderProps {
  currentImage: string;
  onImageUpdate: (newImageUrl: string) => void;
}

const HeroImageUploader: React.FC<HeroImageUploaderProps> = ({ currentImage, onImageUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    onImageUpdate(imageUrl);
    setImageUrl('');
    setIsOpen(false);
    toast({
      title: "Success",
      description: "Hero image updated successfully"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for demo - in production, upload to actual storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpdate(result);
        setIsOpen(false);
        setIsUploading(false);
        toast({
          title: "Success",
          description: "Hero image uploaded successfully"
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-4 right-4 bg-black/50 text-white border-white/20 hover:bg-black/70"
        >
          <Upload className="h-4 w-4 mr-2" />
          Update Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Hero Image</DialogTitle>
          <DialogDescription>
            Upload a new image or provide a URL. Recommended size: 1920x1080px
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Image File</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WebP. Max size: 5MB
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex space-x-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button onClick={handleUrlSubmit} size="sm">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeroImageUploader;