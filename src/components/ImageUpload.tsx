import React, { useState } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, currentImage }) => {
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

    onImageSelected(imageUrl);
    setImageUrl('');
    toast({
      title: "Success",
      description: "Image URL added successfully"
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
        onImageSelected(result);
        setIsUploading(false);
        toast({
          title: "Success",
          description: "Image uploaded successfully"
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

  const removeImage = () => {
    onImageSelected('');
    toast({
      title: "Success",
      description: "Image removed successfully"
    });
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Selected"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!currentImage && (
        <>
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
              <Button type="button" onClick={handleUrlSubmit} size="sm">
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
        </>
      )}
    </div>
  );
};

export default ImageUpload;