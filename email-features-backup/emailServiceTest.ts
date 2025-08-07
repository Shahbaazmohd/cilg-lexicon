import { emailService } from './emailService';

// Test function to verify email service is working
export const testEmailService = async () => {
  console.log('Testing email service...');
  
  try {
    // Test submission confirmation
    const confirmationResult = await emailService.sendSubmissionConfirmation({
      title: 'Test Blog Post',
      authorName: 'Test Author',
      authorEmail: 'test@example.com',
      category: 'Test Category',
      content: 'This is a test blog post content.',
      excerpt: 'This is a test excerpt.',
      submissionDate: new Date().toLocaleDateString()
    });
    
    console.log('Submission confirmation test:', confirmationResult ? 'SUCCESS' : 'FAILED');
    
    // Test admin notification
    const adminResult = await emailService.sendAdminNotification({
      title: 'Test Blog Post',
      authorName: 'Test Author',
      authorEmail: 'test@example.com',
      category: 'Test Category',
      content: 'This is a test blog post content.',
      excerpt: 'This is a test excerpt.',
      submissionDate: new Date().toLocaleDateString()
    });
    
    console.log('Admin notification test:', adminResult ? 'SUCCESS' : 'FAILED');
    
    // Test approval notification
    const approvalResult = await emailService.sendApprovalNotification({
      title: 'Test Blog Post',
      authorName: 'Test Author',
      authorEmail: 'test@example.com',
      status: 'approved',
      adminComments: 'This is a test approval comment.',
      publishUrl: 'https://cilg.org/blog/test-post'
    });
    
    console.log('Approval notification test:', approvalResult ? 'SUCCESS' : 'FAILED');
    
    // Test rejection notification
    const rejectionResult = await emailService.sendRejectionNotification({
      title: 'Test Blog Post',
      authorName: 'Test Author',
      authorEmail: 'test@example.com',
      status: 'rejected',
      adminComments: 'This is a test rejection comment.'
    });
    
    console.log('Rejection notification test:', rejectionResult ? 'SUCCESS' : 'FAILED');
    
    return {
      confirmation: confirmationResult,
      admin: adminResult,
      approval: approvalResult,
      rejection: rejectionResult
    };
  } catch (error) {
    console.error('Email service test failed:', error);
    return {
      confirmation: false,
      admin: false,
      approval: false,
      rejection: false,
      error: error.message
    };
  }
};
