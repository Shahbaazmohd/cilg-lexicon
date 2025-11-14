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
  async sendEmail(data: any, emailType: 'confirmation' | 'admin' | 'approval' | 'rejection'): Promise<boolean> {
    try {
      // Generate appropriate subject line based on email type
      const getSubject = (type: string, data: any) => {
        switch (type) {
          case 'confirmation':
            return `Article Submission Confirmed - ${data.article_title}`;
          case 'admin':
            return `New Article Submission - ${data.article_title}`;
          case 'approval':
            return `Article Approved - ${data.article_title}`;
          case 'rejection':
            return `Article Review Update - ${data.article_title}`;
          default:
            return 'CILG Article Submission Update';
        }
      };

      // Generate HTML content based on email type
      const generateHTML = (type: string, data: any) => {
        const baseHeader = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${getSubject(type, data)}</title>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9;">
              <!-- Header -->
              <div style="background: #1e40af; color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">CILG</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Cell for International Law and Governance</p>
              </div>
        `;

        const baseFooter = `
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                <p style="margin: 0 0 10px 0;">Cell for International Law and Governance</p>
                <p style="margin: 0 0 5px 0;">Contact: usllscilg@gmail.com</p>
                <p style="margin: 0;">© 2025 CILG. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        let contentHTML = '';

        switch (type) {
          case 'confirmation':
            contentHTML = `
              <!-- Content -->
              <div style="padding: 40px 20px; background: white;">
                <h2 style="color: #1e40af; margin-bottom: 20px;">Article Submission Confirmed</h2>
                <p>Dear ${data.to_name},</p>
                <p>Thank you for submitting your article to the Cell for International Law and Governance (CILG). We have successfully received your submission and it is now under review.</p>
                
                <div style="background: #f8f9fa; padding: 20px; margin: 25px 0; border-left: 4px solid #1e40af; border-radius: 4px;">
                  <h3 style="margin: 0 0 15px 0; color: #1e40af;">Article Details</h3>
                  <p style="margin: 8px 0;"><strong>Title:</strong> ${data.article_title}</p>
                  <p style="margin: 8px 0;"><strong>Category:</strong> ${data.article_category}</p>
                  <p style="margin: 8px 0;"><strong>Submission Date:</strong> ${data.submission_date}</p>
                  <p style="margin: 8px 0;"><strong>Excerpt:</strong> ${data.article_prompt}</p>
                </div>
                
                <p>Our editorial team will review your submission within 48 hours. You will receive an email notification once the review is complete.</p>
                
                <p>If you have any questions about your submission, please contact us at <a href="mailto:usllscilg@gmail.com" style="color: #1e40af;">usllscilg@gmail.com</a>.</p>
                
                <p>Best regards,<br><strong>The CILG Editorial Team</strong></p>
              </div>
            `;
            break;

          case 'admin':
            contentHTML = `
              <!-- Content -->
              <div style="padding: 40px 20px; background: white;">
                <h2 style="color: #1e40af; margin-bottom: 20px;">New Article Submission</h2>
                <p>A new article has been submitted for review.</p>
                
                <div style="background: #f8f9fa; padding: 20px; margin: 25px 0; border-left: 4px solid #1e40af; border-radius: 4px;">
                  <h3 style="margin: 0 0 15px 0; color: #1e40af;">Submission Details</h3>
                  <p style="margin: 8px 0;"><strong>Title:</strong> ${data.article_title}</p>
                  <p style="margin: 8px 0;"><strong>Author:</strong> ${data.author_name}</p>
                  <p style="margin: 8px 0;"><strong>Email:</strong> ${data.author_email}</p>
                  <p style="margin: 8px 0;"><strong>Category:</strong> ${data.article_category}</p>
                  <p style="margin: 8px 0;"><strong>Submission Date:</strong> ${data.submission_date}</p>
                  <p style="margin: 8px 0;"><strong>Content Preview:</strong> ${data.content_preview}</p>
                </div>
                
                <p>Please review this submission in the admin dashboard.</p>
              </div>
            `;
            break;

          case 'approval':
            contentHTML = `
              <!-- Content -->
              <div style="padding: 40px 20px; background: white;">
                <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Article Approved!</h2>
                <p>Dear ${data.to_name},</p>
                <p>We are pleased to inform you that your article has been approved for publication by our editorial team.</p>
                
                <div style="background: #d4edda; padding: 20px; margin: 25px 0; border-left: 4px solid #28a745; border-radius: 4px;">
                  <h3 style="margin: 0 0 15px 0; color: #155724;">Approved Article</h3>
                  <p style="margin: 8px 0;"><strong>Title:</strong> ${data.article_title}</p>
                  <p style="margin: 8px 0;"><strong>Approval Date:</strong> ${data.approved_date}</p>
                  <p style="margin: 8px 0;"><strong>Publication URL:</strong> <a href="${data.publish_url}" style="color: #155724;">${data.publish_url}</a></p>
                  ${data.admin_comments ? `<p style="margin: 8px 0;"><strong>Editorial Comments:</strong> ${data.admin_comments}</p>` : ''}
                </div>
                
                <p>Your article will be published on our website shortly. You can view it at the link provided above.</p>
                
                <p>Thank you for contributing to the Cell for International Law and Governance.</p>
                
                <p>Best regards,<br><strong>The CILG Editorial Team</strong></p>
              </div>
            `;
            break;

          case 'rejection':
            contentHTML = `
              <!-- Content -->
              <div style="padding: 40px 20px; background: white;">
                <h2 style="color: #dc3545; margin-bottom: 20px;">Article Review Update</h2>
                <p>Dear ${data.to_name},</p>
                <p>Thank you for submitting your article to the Cell for International Law and Governance. After careful review by our editorial team, we regret to inform you that we are unable to accept your article for publication at this time.</p>
                
                <div style="background: #f8d7da; padding: 20px; margin: 25px 0; border-left: 4px solid #dc3545; border-radius: 4px;">
                  <h3 style="margin: 0 0 15px 0; color: #721c24;">Article Details</h3>
                  <p style="margin: 8px 0;"><strong>Title:</strong> ${data.article_title}</p>
                  <p style="margin: 8px 0;"><strong>Review Date:</strong> ${data.review_date}</p>
                  ${data.admin_comments ? `<p style="margin: 8px 0;"><strong>Editorial Feedback:</strong> ${data.admin_comments}</p>` : ''}
                </div>
                
                <p>We encourage you to consider our feedback and submit a revised version or a new article in the future. If you have any questions about this decision, please contact us at <a href="mailto:usllscilg@gmail.com" style="color: #1e40af;">usllscilg@gmail.com</a>.</p>
                
                <p>Best regards,<br><strong>The CILG Editorial Team</strong></p>
              </div>
            `;
            break;
        }

        return baseHeader + contentHTML + baseFooter;
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
      approved_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      publish_url: data.publishUrl || 'https://cilg.org/blog',
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
      review_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      admin_comments: data.adminComments || 'We regret to inform you that your article could not be accepted for publication at this time.',
    };

    return this.sendEmail(emailData, 'rejection');
  }
}

export const emailService = new EmailService(); 