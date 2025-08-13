import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, FileText, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { adminSupabase } from '@/integrations/supabase/adminClient';

interface ResourceFileUploadProps {
  onFileSelected: (fileUrl: string, fileName: string, fileSize: number, fileType: string) => void;
  currentFile?: string;
  currentFileName?: string;
  currentFileSize?: number;
  onFileRemoved?: () => void;
}

const ResourceFileUpload: React.FC<ResourceFileUploadProps> = ({ 
  onFileSelected, 
  currentFile, 
  currentFileName,
  currentFileSize,
  onFileRemoved 
}) => {
  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // File validation
  const validateFile = (file: File): boolean => {
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 50MB",
        variant: "destructive"
      });
      return false;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      'text/markdown',
      'text/html',
      'application/xml',
      'application/json',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|rtf|odt|md|html|xml|json|csv|xls|xlsx|ppt|pptx)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid document file",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Generate unique filename
  const generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload to Supabase storage
  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileName = generateUniqueFileName(file.name);
    const filePath = `resources/${fileName}`;

    const { data, error } = await adminSupabase.storage
      .from('resources')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to Supabase
      const fileUrl = await uploadToSupabase(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      onFileSelected(fileUrl, file.name, file.size, file.type);
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "File uploaded successfully"
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setSelectedFile(null);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlSubmit = () => {
    if (!fileUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid file URL",
        variant: "destructive"
      });
      return;
    }

    // For URL input, we need to extract filename and size from the URL
    const fileName = fileUrl.split('/').pop() || 'External File';
    onFileSelected(fileUrl, fileName, 0, 'application/octet-stream');
    setFileUrl('');
    toast({
      title: "Success",
      description: "File URL added successfully"
    });
  };

  const removeFile = async () => {
    if (currentFile && currentFile.includes('supabase.co')) {
      try {
        // Extract file path from URL
        const urlParts = currentFile.split('/');
        const filePath = urlParts.slice(urlParts.indexOf('resources')).join('/');
        
        if (filePath) {
          // Delete from Supabase storage
          const { error } = await adminSupabase.storage
            .from('resources')
            .remove([filePath]);

          if (error) {
            console.error('Error deleting file:', error);
          }
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    onFileSelected('', '', 0, '');
    if (onFileRemoved) {
      onFileRemoved();
    }
    
    toast({
      title: "Success",
      description: "File removed successfully"
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {currentFile && (
        <div className="relative group">
          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">{currentFileName}</p>
              {currentFileSize && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentFileSize)}
                </p>
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(currentFile, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeFile}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {!currentFile && (
        <>
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Document File</Label>
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
                accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.md,.html,.xml,.json,.csv,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOC, DOCX, TXT, RTF, ODT, MD, HTML, XML, JSON, CSV, XLS, XLSX, PPT, PPTX. Max size: 50MB.
            </p>
            {selectedFile && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {formatFileSize(selectedFile.size)}</p>
                <p>Type: {selectedFile.type}</p>
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
            <Label htmlFor="file-url">File URL</Label>
            <div className="flex space-x-2">
              <Input
                id="file-url"
                placeholder="https://example.com/document.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
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

export default ResourceFileUpload;
