import { useState } from 'react';
import { Mail, MapPin, Send, MessageSquare, Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ContactService, ContactFormData } from '@/lib/contactService';

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    inquiry_type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const inquiryTypes = [
    'General Information',
    'Research Collaboration',
    'Event Inquiry',
    'Media Request',
    'Student Affairs',
    'Publication Submission',
    'Technical Support',
    'Other'
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await ContactService.submitContactMessage(formData);
      
      if (success) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting us. We will get back to you within 1-2 business days.",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          inquiry_type: '',
          message: ''
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.subject && 
                     formData.inquiry_type && formData.message;

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="academic-heading text-4xl md:text-5xl mb-6">
            Contact Us
          </h1>
          <p className="academic-text text-lg max-w-2xl mx-auto">
            Get in touch with our team for inquiries about research, collaboration, 
            events, or any other questions about CILG.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>General Inquiries</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Email</p>
                  <a href="mailto:usllscilg@gmail.com" className="text-primary hover:underline">
                    usllscilg@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Visit Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic academic-text">
                  Cell for International Law and Governance<br />
                  University School of Law &amp; Legal Studies,<br />
                  GGSIPU<br />
                  Dwarka, Delhi - 110078<br />
                  India
                </address>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Connect With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Follow us on social media for the latest updates and insights.
                </p>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.linkedin.com/company/uslls-cilg/?originalSubdomain=in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="text-sm">LinkedIn</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a 
                    href="https://www.instagram.com/uslls_cilg/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm">Instagram</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have a question or want to collaborate? We'd love to hear from you. 
                  Send us a message using the form and we'll respond as soon as possible.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>We typically respond within 24-48 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief subject of your inquiry"
                      required
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-2">
                    <Label htmlFor="inquiry_type">Type of Inquiry *</Label>
                    <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange('inquiry_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of your inquiry" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Please be as detailed as possible to help us respond effectively.
                    </p>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Privacy Notice:</strong> Your information will be used solely for responding to your inquiry. 
                      We do not share personal information with third parties. By submitting this form, 
                      you consent to our use of your data for this purpose.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </div>
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

export default Contact;