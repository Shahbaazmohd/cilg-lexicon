import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EMAILJS_CONFIG } from '@/lib/emailConfig';
import { emailService } from '@/lib/emailService';

const EmailDebug = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const checkConfiguration = () => {
    const issues = [];
    
    // Check Service ID
    if (EMAILJS_CONFIG.SERVICE_ID === 'service_your_service_id') {
      issues.push('❌ Service ID is still placeholder - replace with your actual service ID');
    } else {
      issues.push('✅ Service ID is configured');
    }
    
    // Check User ID
    if (EMAILJS_CONFIG.USER_ID === 'your_user_id') {
      issues.push('❌ User ID is still placeholder - replace with your actual public key');
    } else {
      issues.push('✅ User ID is configured');
    }
    
    // Check Template ID
    if (EMAILJS_CONFIG.TEMPLATES.UNIVERSAL === 'template_universal') {
      issues.push('✅ Template ID is configured (make sure template exists in EmailJS)');
    } else {
      issues.push('❌ Template ID is not configured correctly');
    }
    
    setDebugInfo(issues.join('\n'));
  };

  const showCurrentConfig = () => {
    const config = {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
      USER_ID: EMAILJS_CONFIG.USER_ID,
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATES.UNIVERSAL
    };
    
    setDebugInfo(`Current Configuration:\n${JSON.stringify(config, null, 2)}`);
  };

  const testEmailDelivery = async () => {
    setIsLoading(true);
    setDebugInfo('Testing email delivery...');
    
    try {
      const result = await emailService.sendSubmissionConfirmation({
        title: 'Test Email',
        authorName: 'Test User',
        authorEmail: 'test@example.com', // Change this to your email
        category: 'Test Category',
        content: 'This is a test email to check delivery.',
        excerpt: 'Test excerpt',
        submissionDate: new Date().toLocaleDateString()
      });
      
      if (result) {
        setDebugInfo('✅ Email API call successful\n\nNext steps:\n1. Check EmailJS dashboard for delivery status\n2. Check spam folder\n3. Verify email service configuration\n4. Check EmailJS account credits');
      } else {
        setDebugInfo('❌ Email API call failed\n\nCheck:\n1. EmailJS service configuration\n2. Template exists and is published\n3. Account has sufficient credits');
      }
    } catch (error) {
      setDebugInfo(`❌ Error: ${error}\n\nCheck browser console for more details`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCommonIssues = () => {
    const issues = [
      '🔍 Common Email Delivery Issues:',
      '',
      '1. Email Service Configuration:',
      '   - Check if your email service (Gmail, Outlook, etc.) is properly configured',
      '   - Verify sender email address is correct',
      '   - Check if 2FA is enabled (may require app password)',
      '',
      '2. EmailJS Dashboard:',
      '   - Go to EmailJS dashboard → Email Services',
      '   - Check if service shows "Connected" status',
      '   - Verify template is published',
      '',
      '3. Email Delivery:',
      '   - Check spam/junk folder',
      '   - Verify recipient email address is correct',
      '   - Check EmailJS account has sufficient credits',
      '',
      '4. Template Issues:',
      '   - Ensure template ID matches exactly: template_universal',
      '   - Check template variables are correct',
      '   - Verify template is published',
      '',
      '5. Browser Console:',
      '   - Open browser developer tools (F12)',
      '   - Check Console tab for error messages',
      '   - Look for EmailJS related errors'
    ];
    
    setDebugInfo(issues.join('\n'));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Debug</CardTitle>
          <CardDescription>
            Check your EmailJS configuration and identify delivery issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={checkConfiguration} variant="outline">
              Check Configuration
            </Button>
            <Button onClick={showCurrentConfig} variant="outline">
              Show Current Config
            </Button>
            <Button onClick={testEmailDelivery} variant="outline" disabled={isLoading}>
              {isLoading ? 'Testing...' : 'Test Email Delivery'}
            </Button>
            <Button onClick={checkCommonIssues} variant="outline">
              Common Issues
            </Button>
          </div>
          
          {debugInfo && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
                {debugInfo}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Quick Fix Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">EmailJS Dashboard</a></li>
              <li>Check "Email Services" - ensure service is connected</li>
              <li>Check "Email Templates" - ensure template is published</li>
              <li>Check "Account" - verify you have credits</li>
              <li>Check your spam folder for test emails</li>
              <li>Update test email address to your real email</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailDebug; 