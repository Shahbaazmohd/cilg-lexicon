import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/lib/emailConfig';

const SimpleEmailTest = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const sendSimpleTest = async () => {
    if (!email) {
      setResult('❌ Please enter an email address');
      return;
    }

    setIsLoading(true);
    setResult('Sending test email...');

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_CONFIG.USER_ID);

      // Prepare template parameters
      const templateParams = {
        to_email: email, // This should be the recipient email
        to_name: 'Test User',
        article_title: 'Simple Test Email',
        category: 'Test',
        submission_date: new Date().toLocaleDateString(),
        excerpt: 'This is a simple test email to verify delivery.',
        subject: 'Test Email from CILG Blog System',
        email_type: 'confirmation'
      };

      console.log('Sending email with params:', templateParams);

      // Send simple test email
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATES.UNIVERSAL,
        templateParams
      );

      console.log('EmailJS Response:', response);
      setResult(`✅ Email sent successfully!\nStatus: ${response.status}\nText: ${response.text}\n\nRecipient: ${email}\n\nCheck your email inbox and spam folder.`);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setResult(`❌ Error sending email:\n${error}\n\nCheck browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Simple Email Test</CardTitle>
          <CardDescription>
            Test basic email delivery with minimal variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Your Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This email will be sent TO this address
            </p>
          </div>
          
          <Button 
            onClick={sendSimpleTest} 
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Simple Test Email'}
          </Button>
          
          {result && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap text-sm">
                {result}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>This test uses minimal template variables to isolate delivery issues.</p>
            <p>Check your email inbox and spam folder after sending.</p>
            <p><strong>Note:</strong> Make sure your EmailJS template uses the `to_email` variable for the recipient.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleEmailTest; 