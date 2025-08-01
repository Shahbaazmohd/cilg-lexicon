import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, EMAIL_ADDRESSES, WEBSITE_URLS } from './emailConfig';

export interface BlogSubmissionData {
  title: string;
  authorName: string;
  authorEmail: string;
  category: string;
  content: string;
  excerpt?: string;
  submissionDate: string;
}

export interface BlogStatusUpdateData {
  title: string;
  authorName: string;
  authorEmail: string;
  status: 'approved' | 'rejected';
  adminComments?: string;
  publishUrl?: string;
}

class EmailService {
  private isInitialized = false;

  initialize() {
    if (!this.isInitialized) {
      emailjs.init(EMAILJS_CONFIG.USER_ID);
      this.isInitialized = true;
    }
  }

  // Send email using single template with dynamic content
  async sendEmail(data: any, emailType: 'confirmation' | 'admin' | 'approval' | 'rejection'): Promise<boolean> {
    try {
      this.initialize();
      
      const templateParams = {
        ...data,
        email_type: emailType,
        current_date: new Date().toLocaleDateString(),
        admin_email: EMAIL_ADDRESSES.ADMIN_EMAIL,
        contact_email: EMAIL_ADDRESSES.CONTACT_EMAIL,
        admin_name: EMAIL_ADDRESSES.ADMIN_NAME,
        blog_url: WEBSITE_URLS.BLOG_URL,
        base_url: WEBSITE_URLS.BASE_URL
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATES.UNIVERSAL,
        templateParams
      );

      console.log(`${emailType} email sent successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to send ${emailType} email:`, error);
      return false;
    }
  }

  // Send confirmation email to user after submission
  async sendSubmissionConfirmation(data: BlogSubmissionData): Promise<boolean> {
    const emailData = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      category: data.category,
      submission_date: data.submissionDate,
      excerpt: data.excerpt || data.content.substring(0, 200) + '...',
    };

    return this.sendEmail(emailData, 'confirmation');
  }

  // Send notification to admin about new submission
  async sendAdminNotification(data: BlogSubmissionData): Promise<boolean> {
    const emailData = {
      to_email: EMAIL_ADDRESSES.ADMIN_EMAIL,
      to_name: EMAIL_ADDRESSES.ADMIN_NAME,
      author_name: data.authorName,
      author_email: data.authorEmail,
      article_title: data.title,
      category: data.category,
      submission_date: data.submissionDate,
      excerpt: data.excerpt || data.content.substring(0, 300) + '...',
      content_preview: data.content.substring(0, 500) + '...',
    };

    return this.sendEmail(emailData, 'admin');
  }

  // Send approval notification to user
  async sendApprovalNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const emailData = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      approval_date: new Date().toLocaleDateString(),
      publish_url: data.publishUrl || WEBSITE_URLS.BLOG_URL,
      admin_comments: data.adminComments || 'Your article has been approved and will be published shortly.',
    };

    return this.sendEmail(emailData, 'approval');
  }

  // Send rejection notification to user
  async sendRejectionNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const emailData = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      rejection_date: new Date().toLocaleDateString(),
      admin_comments: data.adminComments || 'We regret to inform you that your article could not be accepted for publication at this time.',
    };

    return this.sendEmail(emailData, 'rejection');
  }
}

export const emailService = new EmailService(); 