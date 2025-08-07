import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { testEmailService } from '@/lib/emailServiceTest';

const EmailTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestEmailService = async () => {
    setIsTesting(true);
    setError(null);
    setResults(null);

    try {
      const testResults = await testEmailService();
      setResults(testResults);
    } catch (err: any) {
      setError(err.message || 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Test
          </CardTitle>
          <CardDescription>
            Test the email service functionality to ensure all email notifications are working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTestEmailService} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Email Service...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Test Email Service
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Test Results:</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {getStatusIcon(results.confirmation)}
                  <span>Submission Confirmation</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {getStatusIcon(results.admin)}
                  <span>Admin Notification</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {getStatusIcon(results.approval)}
                  <span>Approval Notification</span>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {getStatusIcon(results.rejection)}
                  <span>Rejection Notification</span>
                </div>
              </div>

              {results.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error: {results.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Note:</strong> This test sends actual emails to test@example.com.</p>
                <p>Check the browser console for detailed logs.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTest; 