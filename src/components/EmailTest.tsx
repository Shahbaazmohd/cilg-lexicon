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
    authorEmail: 'test@example.com',
    title: 'Test Article Title',
    category: 'International Law',
    content: 'This is a test article content for email testing.',
    excerpt: 'Test excerpt for the article.'
  });
  const [isTesting, setIsTesting] = useState(false);

  const handleTestEmail = async (emailType: 'confirmation' | 'admin' | 'approval' | 'rejection') => {
    setIsTesting(true);
    
    try {
      let emailSent = false;
      
      switch (emailType) {
        case 'confirmation':
          emailSent = await emailService.sendSubmissionConfirmation({
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
          emailSent = await emailService.sendAdminNotification({
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
          emailSent = await emailService.sendApprovalNotification({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            status: 'approved',
            adminComments: 'This is a test approval with comments.',
            publishUrl: 'https://cilg.org/blog/test-article'
          });
          break;
          
        case 'rejection':
          emailSent = await emailService.sendRejectionNotification({
            title: testData.title,
            authorName: testData.authorName,
            authorEmail: testData.authorEmail,
            status: 'rejected',
            adminComments: 'This is a test rejection with feedback.'
          });
          break;
      }
      
      if (emailSent) {
        toast({
          title: "Email Test Successful",
          description: `${emailType} email sent successfully to ${testData.authorEmail}`,
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
        description: `Error testing ${emailType} email: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="academic-container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="academic-heading text-4xl mb-4">Email Functionality Test</h1>
          <p className="academic-text text-lg">
            Test the email functionality for blog submission and approval workflow
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Data</CardTitle>
            <CardDescription>
              Configure the test data for email testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={testData.excerpt}
                onChange={(e) => setTestData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={testData.content}
                onChange={(e) => setTestData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Emails</CardTitle>
              <CardDescription>
                Test emails sent during blog submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleTestEmail('confirmation')}
                disabled={isTesting}
                className="w-full"
              >
                Test Submission Confirmation
              </Button>
              <Button
                onClick={() => handleTestEmail('admin')}
                disabled={isTesting}
                variant="outline"
                className="w-full"
              >
                Test Admin Notification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Emails</CardTitle>
              <CardDescription>
                Test emails sent during approval/rejection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleTestEmail('approval')}
                disabled={isTesting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Test Approval Email
              </Button>
              <Button
                onClick={() => handleTestEmail('rejection')}
                disabled={isTesting}
                variant="destructive"
                className="w-full"
              >
                Test Rejection Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h3>
          <ol className="text-blue-700 space-y-1 text-sm">
            <li>1. Update the test data above with your email address</li>
            <li>2. Click any test button to send a test email</li>
            <li>3. Check your email inbox for the test message</li>
            <li>4. Verify the email content and formatting</li>
            <li>5. Check the browser console for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 