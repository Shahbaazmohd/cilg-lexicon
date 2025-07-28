import React, { useState } from 'react';
import { Upload, FileText, Mail, User, BookOpen, Tag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import emailjs from '@emailjs/browser';

const SubmitBlog = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    category: '',
    excerpt: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'International Law',
    'Human Rights',
    'Trade Law',
    'Environmental Law',
    'Constitutional Law',
    'Corporate Law',
    'Criminal Law',
    'Civil Rights'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
            category: formData.category,
            excerpt: excerpt,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Send email notification using EmailJS
      try {
        await emailjs.send(
          'service_your_service_id', // You'll need to replace this
          'template_your_template_id', // You'll need to replace this
          {
            from_name: formData.authorName,
            from_email: formData.authorEmail,
            title: formData.title,
            category: formData.category,
            content: formData.content.substring(0, 500) + '...',
            to_email: 'admin@cilg.org' // Replace with your admin email
          },
          'your_user_id' // You'll need to replace this
        );
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
        // Don't fail the whole submission if email fails
      }

      toast({
        title: "Submission Successful!",
        description: "Your blog post has been submitted for review. You'll receive an email confirmation shortly.",
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        authorName: '',
        authorEmail: '',
        category: '',
        excerpt: '',
        imageUrl: ''
      });

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
                     formData.authorEmail && formData.category;

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
                    <li>• Original research or analysis</li>
                    <li>• Minimum 1,500 words</li>
                    <li>• Proper citations and references</li>
                    <li>• Clear abstract or excerpt</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Review Process</h4>
                  <ul className="text-sm academic-text space-y-1">
                    <li>• Initial review within 48 hours</li>
                    <li>• Peer review for accepted articles</li>
                    <li>• Editorial feedback provided</li>
                    <li>• Publication upon approval</li>
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
                      Minimum 1,500 words recommended
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