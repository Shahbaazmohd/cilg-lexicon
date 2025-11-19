import React, { useState } from 'react';
import { Upload, FileText, Mail, User, BookOpen, Tag, Send, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from '@/lib/emailService';
import { BlogImageService } from '@/lib/blogImageService';

const SubmitBlog = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    authorDesignation: '',
    category: '',
    excerpt: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const categories = [
    'International Criminal Law',
    'International Relations',
    'International Investment and Trade Law'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Use the enhanced validation from BlogImageService
    const validation = BlogImageService.validateImage(file);
    
    if (!validation.isValid) {
      toast({
        title: "Image Upload Failed",
        description: validation.error,
        variant: "destructive"
      });
      
      // Show additional compression tips
      setTimeout(() => {
        toast({
          title: "Compression Tips",
          description: "Try using TinyPNG, Squoosh.app, or resize your image to 1200x800px",
          variant: "default"
        });
      }, 1000);
      
      return;
    }

    // Show recommendations if any
    if (validation.recommendations && validation.recommendations.length > 0) {
      toast({
        title: "Image Upload Tips",
        description: validation.recommendations[0], // Show first recommendation
        variant: "default"
      });
    }

    setIsUploadingImage(true);
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(false);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that an image is uploaded (mandatory)
      if (!uploadedImage) {
        toast({
          title: "Image Required",
          description: "Please upload a featured image for your article. Image upload is mandatory.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      let imageUrl = '';

      // Upload image (mandatory)
      const uploadResult = await BlogImageService.uploadImage(uploadedImage);
      if (uploadResult.success && uploadResult.imageUrl) {
        imageUrl = uploadResult.imageUrl;
      } else {
        toast({
          title: "Image Upload Failed",
          description: uploadResult.error || "Failed to upload image. Please compress your image and try again.",
          variant: "destructive"
        });
        
        // Show compression tips if available
        if (uploadResult.recommendations && uploadResult.recommendations.length > 0) {
          setTimeout(() => {
            toast({
              title: "Compression Help",
              description: uploadResult.recommendations![0],
              variant: "default"
            });
          }, 1000);
        }
        
        setIsSubmitting(false);
        return;
      }

      // Generate excerpt if not provided
      const excerpt = formData.excerpt || formData.content.substring(0, 200) + '...';
      
      // Submit to Supabase
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            author_name: formData.authorName,
            author_email: formData.authorEmail,
            author_designation: formData.authorDesignation,
            category: formData.category,
            excerpt: excerpt,
            image_url: imageUrl,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Send email notifications
      const submissionDate = new Date().toLocaleDateString();
      
      // Send confirmation email to user
      const userEmailSent = await emailService.sendSubmissionConfirmation({
        title: formData.title,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        category: formData.category,
        content: formData.content,
        excerpt: excerpt,
        submissionDate: submissionDate
      });

      // Send notification to admin
      const adminEmailSent = await emailService.sendAdminNotification({
        title: formData.title,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        category: formData.category,
        content: formData.content,
        excerpt: excerpt,
        submissionDate: submissionDate
      });

      // Show appropriate toast message based on email status
      if (userEmailSent && adminEmailSent) {
        toast({
          title: "Submission Successful!",
          description: "Your blog post has been submitted for review. You'll receive an email confirmation shortly.",
        });
      } else if (userEmailSent) {
        toast({
          title: "Submission Successful!",
          description: "Your blog post has been submitted for review. You'll receive an email confirmation shortly. (Admin notification failed)",
        });
      } else {
        toast({
          title: "Submission Successful!",
          description: "Your blog post has been submitted for review. Email notifications may be delayed.",
        });
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        authorName: '',
        authorEmail: '',
        authorDesignation: '',
        category: '',
        excerpt: '',
        imageUrl: ''
      });
      setUploadedImage(null);
      setImagePreview(null);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.content && formData.authorName && 
                     formData.authorEmail && formData.authorDesignation && formData.category &&
                     uploadedImage !== null; // Image is now mandatory

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-4">
            Submit Your Research
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Share your scholarly contributions with our academic community. 
            Submit your research articles for peer review and publication.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Guidelines */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submission Guidelines
                </CardTitle>
                <CardDescription>
                  Please review these guidelines before submitting your article.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Article Requirements</h4>
                  <ul className="text-sm academic-text space-y-1">
                    <li>• Original and unpublished work</li>
                    <li>• Minimum 800 words (1000-2000 recommended)</li>
                    <li>• Proper citations using BlueBook 21st Edition</li>
                    <li>• Abstract of not more than 100 words</li>
                    <li>• No AI tools like ChatGPT allowed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formatting</h4>
                  <ul className="text-sm academic-text space-y-1">
                    <li>• Font: Times New Roman, Size 12</li>
                    <li>• Line Spacing: 1.5</li>
                    <li>• Text Alignment: Justified</li>
                    <li>• Citations: Endnotes, Size 10</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Review Process</h4>
                  <ul className="text-sm academic-text space-y-1">
                    <li>• Double-blind review process</li>
                    <li>• Review within 14 days</li>
                    <li>• 10 days for revisions</li>
                    <li>• Co-authorship up to 2 authors</li>
                  </ul>
                </div>
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    You'll receive email updates about your submission status.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Article Submission Form</CardTitle>
                <CardDescription>
                  Complete all fields to submit your article for review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Author Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="authorName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Author Name *
                      </Label>
                      <Input
                        id="authorName"
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => handleInputChange('authorName', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authorEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="authorEmail"
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Author Designation */}
                  <div className="space-y-2">
                    <Label htmlFor="authorDesignation" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Author Designation *
                    </Label>
                    <Input
                      id="authorDesignation"
                      type="text"
                      value={formData.authorDesignation}
                      onChange={(e) => handleInputChange('authorDesignation', e.target.value)}
                      placeholder="e.g., Professor, Researcher, Student, Legal Practitioner"
                      required
                    />
                  </div>

                  {/* Article Details */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Article Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter your article title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">
                      Abstract/Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Brief summary of your article (optional - will be auto-generated if left blank)"
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Featured Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Featured Image *
                    </Label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <ImageIcon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            PNG, JPG, WebP up to <strong>3MB maximum</strong> (recommended: under 1MB)
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                            id="featuredImage"
                          />
                          <label htmlFor="featuredImage">
                            <Button 
                              type="button"
                              disabled={isUploadingImage}
                              className="cursor-pointer"
                              asChild
                            >
                              <span>
                                {isUploadingImage ? (
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
                      )}
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-600 font-medium">* Required:</span> Upload a featured image for your article. This will be displayed alongside your article.
                      </p>
                      <p className="text-xs text-red-600 font-medium">
                        Please use only personally created or public domain/free-use images to ensure no copyright violations.
                      </p>
                      
                      {/* Image Optimization Tips */}
                      <Alert className="bg-blue-50 border-blue-200">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <div className="space-y-1">
                            <p className="font-medium">Image Optimization Tips:</p>
                                                         <ul className="text-xs space-y-1">
                               <li>• <strong>Maximum size: 3MB</strong> (recommended: under 1MB)</li>
                               <li>• Recommended dimensions: 1200x800px</li>
                               <li>• Best formats: JPEG for photos, WebP for modern browsers</li>
                               <li>• Use descriptive filenames for better SEO</li>
                               <li>• <strong>Images over 3MB will be rejected</strong></li>
                             </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Article Content *
                    </Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Enter your complete article content here..."
                      className="min-h-[300px]"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum 800 words required (1000-2000 words recommended)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Article
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBlog;