import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/lib/emailConfig';

const EmailTestWithTo = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const sendTestWithTo = async () => {
    if (!email) {
      setResult('❌ Please enter an email address');
      return;
    }

    setIsLoading(true);
    setResult('Sending test email...');

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_CONFIG.USER_ID);

      // Method 1: Try with explicit to_email parameter
      const templateParams = {
        to_email: email,
        to_name: 'Test User',
        article_title: 'Test Email with To Field',
        category: 'Test',
        submission_date: new Date().toLocaleDateString(),
        excerpt: 'This email should be sent to the specified address.',
        subject: 'Test Email - CILG Blog',
        email_type: 'confirmation'
      };

      console.log('Sending email to:', email);
      console.log('Template params:', templateParams);

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
          <CardTitle>Email Test with To Field</CardTitle>
          <CardDescription>
            Test email delivery with explicit recipient configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Recipient Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This email will be sent TO this address (not from it)
            </p>
          </div>
          
          <Button 
            onClick={sendTestWithTo} 
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
          
          {result && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap text-sm">
                {result}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Important:</strong> Make sure your EmailJS template is configured to use the `to_email` variable as the recipient.</p>
            <p>If emails are still going to the sender, check your EmailJS template settings.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestWithTo; 