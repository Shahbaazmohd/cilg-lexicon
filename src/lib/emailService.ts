import { supabase } from '../integrations/supabase/client';

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
  // Send email using Supabase Edge Function
  async sendEmail(data: any, emailType: 'confirmation' | 'admin'): Promise<boolean> {
    try {
      // Generate appropriate subject line based on email type
      const getSubject = (type: string, data: any) => {
        switch (type) {
          case 'confirmation':
            return `Article Submission Confirmed - ${data.article_title}`;
          case 'admin':
            return `New Article Submission - ${data.article_title}`;
          default:
            return 'CILG Article Submission Update';
        }
      };

      // Generate HTML content based on email type
      const generateHTML = (type: string, data: any) => {
        const baseHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${getSubject(type, data)}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">CILG</h1>
                <p style="margin: 5px 0 0 0;">Center for International Law and Governance</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px; background: white;">
                <h2 style="color: #1e40af;">Article Submission Confirmed</h2>
                <p>Dear ${data.to_name},</p>
                <p>Thank you for submitting your article to CILG. We have received your submission and it is now under review.</p>
                
                <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #1e40af;">
                  <h3 style="margin: 0 0 10px 0;">Article Details</h3>
                  <p><strong>Title:</strong> ${data.article_title}</p>
                  <p><strong>Category:</strong> ${data.article_category}</p>
                  <p><strong>Submission Date:</strong> ${data.submission_date}</p>
                  <p><strong>Excerpt:</strong> ${data.article_prompt}</p>
                </div>
                
                <p>Our editorial team will review your submission within 48 hours. You will receive an email notification once the review is complete.</p>
                
                <p>If you have any questions, please contact us at usllscilg@gmail.com.</p>
                
                <p>Best regards,<br>The CILG Editorial Team</p>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                <p>Center for International Law and Governance</p>
                <p>Contact: usllscilg@gmail.com | Website: https://cilg.org</p>
              </div>
            </div>
          </body>
          </html>
        `;

        return baseHTML;
      };

      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: data.to_email,
          subject: getSubject(emailType, data),
          html: generateHTML(emailType, data),
          emailType
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return false;
      }

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
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 200) + '...',
    };

    return this.sendEmail(emailData, 'confirmation');
  }

  // Send notification to admin about new submission
  async sendAdminNotification(data: BlogSubmissionData): Promise<boolean> {
    const emailData = {
      to_email: 'usllscilg@gmail.com',
      to_name: 'CILG Admin',
      author_name: data.authorName,
      author_email: data.authorEmail,
      article_title: data.title,
      article_category: data.category,
      submission_date: data.submissionDate,
      article_prompt: data.excerpt || data.content.substring(0, 300) + '...',
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
      approved_date: new Date().toLocaleDateString(),
      publish_url: data.publishUrl || 'https://cilg.org/blog',
      admin_comments: data.adminComments || 'Your article has been approved and will be published shortly.',
    };

    return this.sendEmail(emailData, 'confirmation');
  }

  // Send rejection notification to user
  async sendRejectionNotification(data: BlogStatusUpdateData): Promise<boolean> {
    const emailData = {
      to_email: data.authorEmail,
      to_name: data.authorName,
      article_title: data.title,
      review_date: new Date().toLocaleDateString(),
      admin_comments: data.adminComments || 'We regret to inform you that your article could not be accepted for publication at this time.',
    };

    return this.sendEmail(emailData, 'confirmation');
  }
}

export const emailService = new EmailService(); 