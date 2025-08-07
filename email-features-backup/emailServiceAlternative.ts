// Alternative Email Service using EmailJS
// This can be used as a backup if Resend.com is not working

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

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

class EmailServiceAlternative {
  private config: EmailJSConfig | null = null;

  constructor() {
    // Load EmailJS configuration from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      this.config = {
        serviceId,
        templateId,
        publicKey
      };
    }
  }

  private async loadEmailJS(): Promise<any> {
    // Dynamically load EmailJS
    if (typeof window !== 'undefined' && !window.emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.emailjs) {
            window.emailjs.init(this.config!.publicKey);
            resolve(window.emailjs);
          } else {
            reject(new Error('EmailJS failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load EmailJS'));
        document.head.appendChild(script);
      });
    }
    
    return window.emailjs;
  }

  async sendEmail(templateParams: any, templateId: string): Promise<boolean> {
    if (!this.config) {
      console.error('EmailJS not configured');
      return false;
    }

    try {
      const emailjs = await this.loadEmailJS();
      
      const result = await emailjs.send(
        this.config.serviceId,
        templateId,
        templateParams
      );

      console.log('EmailJS email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('EmailJS email sending error:', error);
      return false;
    }
  }

  // Send confirmation email to user after submission
  async sendSubmissionConfirmation(data: BlogSubmissionData): Promise<boolean> {
    const templateParams = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 200) + '...',
      message_type: 'confirmation'
    };

    return this.sendEmail(templateParams, 'template_confirmation');
  }

  // Send notification to admin about new submission
  async sendAdminNotification(data: BlogSubmissionData): Promise<boolean> {
    const templateParams = {
      to_email: 'usllscilg@gmail.com',
      to_name: 'CILG Admin',
      author_name: data.authorName,
      author_email: data.authorEmail,
      article_title: data.title,
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 300) + '...',
      content_preview: data.content.substring(0, 500) + '...',
      message_type: 'admin_notification'
    };

    return this.sendEmail(templateParams, 'template_admin');
  }

  // Send approval notification to user
  async sendApprovalNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const templateParams = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      approved_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      publish_url: data.publishUrl || 'https://cilg.org/blog',
      admin_comments: data.adminComments || 'Your article has been approved and will be published shortly.',
      message_type: 'approval'
    };

    return this.sendEmail(templateParams, 'template_approval');
  }

  // Send rejection notification to user
  async sendRejectionNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const templateParams = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      review_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      admin_comments: data.adminComments || 'We regret to inform you that your article could not be accepted for publication at this time.',
      message_type: 'rejection'
    };

    return this.sendEmail(templateParams, 'template_rejection');
  }
}

export const emailServiceAlternative = new EmailServiceAlternative();

// Type declaration for EmailJS
declare global {
  interface Window {
    emailjs: any;
  }
}
