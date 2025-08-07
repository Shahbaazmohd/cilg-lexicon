import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  validateImageFile, 
  validateImageUrl, 
  optimizeImage, 
  generateUniqueFileName,
  extractFilePathFromUrl,
  isSupabaseStorageUrl,
  formatFileSize
} from '@/lib/imageUtils';

interface EventImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
}

const EventImageUpload: React.FC<EventImageUploadProps> = ({ 
  onImageSelected, 
  currentImage, 
  onImageRemoved 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Image validation using utility function
  const validateImage = (file: File): boolean => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Upload to Supabase storage
  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileName = generateUniqueFileName(file.name);
    const filePath = `events-images/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('events-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // Check if it's a bucket not found error
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          console.error('Bucket error:', error);
          throw new Error('Storage bucket not configured. Please contact the administrator to set up image storage.');
        }
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('events-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadToSupabase:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    let progressInterval: NodeJS.Timeout;

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Optimize image
      console.log('Optimizing image...');
      const optimizedFile = await optimizeImage(file);
      console.log('Image optimized successfully');
      
      // Upload to Supabase
      console.log('Uploading to Supabase...');
      const imageUrl = await uploadToSupabase(optimizedFile);
      console.log('Upload successful, image URL:', imageUrl);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      onImageSelected(imageUrl);
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      clearInterval(progressInterval!);
      setSelectedFile(null);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlSubmit = () => {
    const validation = validateImageUrl(imageUrl);
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
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

  const removeImage = async () => {
    if (currentImage && isSupabaseStorageUrl(currentImage)) {
      try {
        const filePath = extractFilePathFromUrl(currentImage, 'events-images');
        if (filePath) {
          // Delete from Supabase storage
          const { error } = await supabase.storage
            .from('events-images')
            .remove([filePath]);

          if (error) {
            console.error('Error deleting image:', error);
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    onImageSelected('');
    if (onImageRemoved) {
      onImageRemoved();
    }
    
    toast({
      title: "Success",
      description: "Image removed successfully"
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Selected"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {!currentImage && (
        <>
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Image File</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WebP. Max size: 5MB. Images will be automatically optimized.
            </p>
            <p className="text-xs text-orange-600">
              ⚠️ If file upload fails, please use the URL option below or contact the administrator.
            </p>
            {selectedFile && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {formatFileSize(selectedFile.size)}</p>
              </div>
            )}
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
                disabled={isUploading}
              />
              <Button 
                type="button" 
                onClick={handleUrlSubmit} 
                size="sm"
                disabled={isUploading}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="text-center py-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventImageUpload;