import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/lib/emailService';

const EmailTest = () => {
  const { toast } = useToast();
  const [testData, setTestData] = useState({
    authorName: 'Test Author',
    authorEmail: 'your-email@example.com', // Replace with your actual email
    title: 'Test Article Title',
    category: 'International Law',
    content: 'This is a test article content for email testing purposes.',
    excerpt: 'Test excerpt for the article.',
    adminComments: 'Test admin comments for approval/rejection.'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async (emailType: 'confirmation' | 'admin' | 'approval' | 'rejection') => {
    setIsLoading(true);
    
    try {
      let success = false;
      
      switch (emailType) {
        case 'confirmation':
          success = await emailService.sendSubmissionConfirmation({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            category: testData.category,
            content: testData.content,
            excerpt: testData.excerpt,
            submissionDate: new Date().toLocaleDateString()
          });
          break;
          
        case 'admin':
          success = await emailService.sendAdminNotification({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            category: testData.category,
            content: testData.content,
            excerpt: testData.excerpt,
            submissionDate: new Date().toLocaleDateString()
          });
          break;
          
        case 'approval':
          success = await emailService.sendApprovalNotification({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            status: 'approved',
            adminComments: testData.adminComments,
            publishUrl: 'https://cilg.org/blog/test-article'
          });
          break;
          
        case 'rejection':
          success = await emailService.sendRejectionNotification({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            status: 'rejected',
            adminComments: testData.adminComments
          });
          break;
      }
      
      if (success) {
        toast({
          title: "Email Test Successful",
          description: `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email sent successfully!`,
        });
      } else {
        toast({
          title: "Email Test Failed",
          description: `Failed to send ${emailType} email. Check console for details.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Test Error",
        description: `Error testing ${emailType} email: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Email Notification Test</CardTitle>
          <CardDescription>
            Test the email notification system. Make sure to configure EmailJS first.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Data Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                value={testData.authorName}
                onChange={(e) => setTestData(prev => ({ ...prev, authorName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="authorEmail">Author Email</Label>
              <Input
                id="authorEmail"
                type="email"
                value={testData.authorEmail}
                onChange={(e) => setTestData(prev => ({ ...prev, authorEmail: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              value={testData.title}
              onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={testData.category}
              onChange={(e) => setTestData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={testData.content}
              onChange={(e) => setTestData(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={testData.excerpt}
              onChange={(e) => setTestData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="adminComments">Admin Comments</Label>
            <Textarea
              id="adminComments"
              value={testData.adminComments}
              onChange={(e) => setTestData(prev => ({ ...prev, adminComments: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleTestEmail('confirmation')}
              disabled={isLoading}
              variant="outline"
            >
              Test Confirmation
            </Button>
            
            <Button
              onClick={() => handleTestEmail('admin')}
              disabled={isLoading}
              variant="outline"
            >
              Test Admin Notification
            </Button>
            
            <Button
              onClick={() => handleTestEmail('approval')}
              disabled={isLoading}
              variant="outline"
            >
              Test Approval
            </Button>
            
            <Button
              onClick={() => handleTestEmail('rejection')}
              disabled={isLoading}
              variant="outline"
            >
              Test Rejection
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Configure EmailJS in <code>src/lib/emailConfig.ts</code></li>
              <li>Create email templates in EmailJS dashboard</li>
              <li>Update the test data above with real email addresses</li>
              <li>Click test buttons to verify email functionality</li>
              <li>Check your email inbox for test messages</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTest; 