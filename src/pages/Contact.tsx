import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiry: '',
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for contacting us. We will get back to you within 1-2 business days.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      inquiry: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.email && formData.subject && 
                     formData.inquiry && formData.message;

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
                  <a href="mailto:info@cilg.edu" className="text-primary hover:underline">
                    info@cilg.edu
                  </a>
                </div>
                <div>
                  <p className="font-medium mb-1">Phone</p>
                  <a href="tel:+911234567890" className="text-primary hover:underline">
                    +91 123 456 7890
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
                  Centre for International Law and Governance<br />
                  Faculty of Law<br />
                  University Campus<br />
                  City, State - 110001<br />
                  India
                </address>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Office Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Specific Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Specific Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Research Collaboration</p>
                  <a href="mailto:research@cilg.edu" className="text-sm text-primary hover:underline">
                    research@cilg.edu
                  </a>
                </div>
                <div>
                  <p className="font-medium text-sm">Publication Submissions</p>
                  <a href="mailto:submissions@cilg.edu" className="text-sm text-primary hover:underline">
                    submissions@cilg.edu
                  </a>
                </div>
                <div>
                  <p className="font-medium text-sm">Media Inquiries</p>
                  <a href="mailto:media@cilg.edu" className="text-sm text-primary hover:underline">
                    media@cilg.edu
                  </a>
                </div>
                <div>
                  <p className="font-medium text-sm">Student Affairs</p>
                  <a href="mailto:students@cilg.edu" className="text-sm text-primary hover:underline">
                    students@cilg.edu
                  </a>
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
                    <Label htmlFor="inquiry">Type of Inquiry *</Label>
                    <Select value={formData.inquiry} onValueChange={(value) => handleInputChange('inquiry', value)}>
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

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Find Us on Campus</CardTitle>
              <CardDescription>
                Our office is located in the Faculty of Law building on the main campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Interactive campus map would be embedded here
                  </p>
                  <Button variant="outline" className="mt-4">
                    View Campus Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center bg-muted/30 rounded-lg p-8">
          <h2 className="academic-heading text-2xl mb-4">Frequently Asked Questions</h2>
          <p className="academic-text mb-6">
            Before reaching out, you might find the answer to your question in our FAQ section.
          </p>
          <Button variant="outline">
            View FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;