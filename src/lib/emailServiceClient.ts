// Client-side email service using EmailJS
// No passwords needed - uses EmailJS service

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

class EmailServiceClient {
  private emailjs: any;

  constructor() {
    // Load EmailJS dynamically
    this.loadEmailJS();
  }

  private async loadEmailJS() {
    try {
      // Load EmailJS from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        this.emailjs = window.emailjs;
        // Initialize with your EmailJS public key
        this.emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
      };
    } catch (error) {
      console.error('Failed to load EmailJS:', error);
    }
  }

  private async sendEmailJS(templateId: string, templateParams: any): Promise<boolean> {
    if (!this.emailjs) {
      console.error('EmailJS not loaded');
      return false;
    }

    try {
      const result = await this.emailjs.send(
        'YOUR_EMAILJS_SERVICE_ID', // Replace with your service ID
        templateId,
        templateParams,
        'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your public key
      );
      
      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('EmailJS error:', error);
      return false;
    }
  }

  // Send confirmation email to user after submission
  async sendSubmissionConfirmation(data: BlogSubmissionData): Promise<boolean> {
    const templateParams = {
      to_name: data.authorName,
      to_email: data.authorEmail,
      article_title: data.title,
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 200) + '...',
    };

    return this.sendEmailJS('template_submission_confirmation', templateParams);
  }

  // Send notification to admin about new submission
  async sendAdminNotification(data: BlogSubmissionData): Promise<boolean> {
    const templateParams = {
      to_name: 'CILG Admin',
      to_email: 'usllscilg@gmail.com',
      author_name: data.authorName,
      author_email: data.authorEmail,
      article_title: data.title,
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 300) + '...',
      content_preview: data.content.substring(0, 500) + '...',
    };

    return this.sendEmailJS('template_admin_notification', templateParams);
  }

  // Send approval notification to user
  async sendApprovalNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const templateParams = {
      to_name: data.authorName,
      to_email: data.authorEmail,
      article_title: data.title,
      approved_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      publish_url: data.publishUrl || 'https://cilg.org/blog',
      admin_comments: data.adminComments || 'Your article has been approved and will be published shortly.',
    };

    return this.sendEmailJS('template_approval', templateParams);
  }

  // Send rejection notification to user
  async sendRejectionNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const templateParams = {
      to_name: data.authorName,
      to_email: data.authorEmail,
      article_title: data.title,
      review_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      admin_comments: data.adminComments || 'We regret to inform you that your article could not be accepted for publication at this time.',
    };

    return this.sendEmailJS('template_rejection', templateParams);
  }
}

export const emailServiceClient = new EmailServiceClient(); 