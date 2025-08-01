# Single Template Email Solution

Since you've reached the EmailJS template limit, this guide shows how to use a single template for all email types.

## Step 1: Create Single EmailJS Template

### Template Details:
- **Template ID**: `template_universal`
- **Subject**: `{{subject}}`

### Template Content:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">CILG Blog</h1>
    </div>
    
    <!-- Content -->
    <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        
        <!-- Confirmation Email -->
        {{#if (eq email_type "confirmation")}}
            <h2 style="color: #1e40af; margin-bottom: 20px;">Submission Confirmation</h2>
            <p>Dear {{to_name}},</p>
            <p>Thank you for submitting your article <strong>"{{article_title}}"</strong> to the CILG Blog.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; color: #1e40af;">Submission Details:</h3>
                <ul style="margin: 10px 0;">
                    <li><strong>Title:</strong> {{article_title}}</li>
                    <li><strong>Category:</strong> {{category}}</li>
                    <li><strong>Submission Date:</strong> {{submission_date}}</li>
                </ul>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Article Preview:</h4>
                <p style="margin: 0; font-style: italic;">{{excerpt}}</p>
            </div>
            
            <p>Your article has been received and is currently under review. You will receive an email notification once the review process is complete.</p>
            <p>If you have any questions, please contact us at <a href="mailto:{{admin_email}}" style="color: #1e40af;">{{admin_email}}</a>.</p>
        {{/if}}
        
        <!-- Admin Notification Email -->
        {{#if (eq email_type "admin")}}
            <h2 style="color: #1e40af; margin-bottom: 20px;">New Blog Submission</h2>
            <p>A new blog submission has been received:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0; color: #1e40af;">Submission Details:</h3>
                <ul style="margin: 10px 0;">
                    <li><strong>Author:</strong> {{author_name}} ({{author_email}})</li>
                    <li><strong>Title:</strong> {{article_title}}</li>
                    <li><strong>Category:</strong> {{category}}</li>
                    <li><strong>Submission Date:</strong> {{submission_date}}</li>
                </ul>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Excerpt:</h4>
                <p style="margin: 0; font-style: italic;">{{excerpt}}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Content Preview:</h4>
                <p style="margin: 0;">{{content_preview}}</p>
            </div>
            
            <p>Please review this submission in the admin dashboard.</p>
        {{/if}}
        
        <!-- Approval Email -->
        {{#if (eq email_type "approval")}}
            <h2 style="color: #1e40af; margin-bottom: 20px;">Article Approved!</h2>
            <p>Dear {{to_name}},</p>
            <p>Great news! Your article <strong>"{{article_title}}"</strong> has been approved for publication.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; color: #1e40af;">Approval Details:</h3>
                <ul style="margin: 10px 0;">
                    <li><strong>Approval Date:</strong> {{approval_date}}</li>
                    <li><strong>Publication URL:</strong> <a href="{{publish_url}}" style="color: #1e40af;">{{publish_url}}</a></li>
                </ul>
            </div>
            
            {{#if admin_comments}}
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Editorial Comments:</h4>
                <p style="margin: 0; font-style: italic;">{{admin_comments}}</p>
            </div>
            {{/if}}
            
            <p>Your article will be published shortly. Thank you for contributing to the CILG Blog!</p>
        {{/if}}
        
        <!-- Rejection Email -->
        {{#if (eq email_type "rejection")}}
            <h2 style="color: #1e40af; margin-bottom: 20px;">Article Submission Update</h2>
            <p>Dear {{to_name}},</p>
            <p>Thank you for submitting your article <strong>"{{article_title}}"</strong> to the CILG Blog.</p>
            <p>After careful review, we regret to inform you that we are unable to accept your article for publication at this time.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin-top: 0; color: #1e40af;">Review Details:</h3>
                <ul style="margin: 10px 0;">
                    <li><strong>Review Date:</strong> {{rejection_date}}</li>
                </ul>
            </div>
            
            {{#if admin_comments}}
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">Editorial Feedback:</h4>
                <p style="margin: 0; font-style: italic;">{{admin_comments}}</p>
            </div>
            {{/if}}
            
            <p>We encourage you to consider our feedback and submit revised work in the future. If you have any questions, please contact us at <a href="mailto:{{contact_email}}" style="color: #1e40af;">{{contact_email}}</a>.</p>
            <p>Thank you for your interest in contributing to the CILG Blog.</p>
        {{/if}}
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
            <p style="margin: 0;">Best regards,<br><strong>CILG Editorial Team</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
                <a href="{{base_url}}" style="color: #1e40af;">{{base_url}}</a>
            </p>
        </div>
        
    </div>
</body>
</html>
```

## Step 2: Update Configuration

Update `src/lib/emailConfig.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',
  USER_ID: 'your_actual_user_id',
  TEMPLATES: {
    UNIVERSAL: 'template_universal',
  }
};
```

## Step 3: Alternative Solutions

If the single template approach doesn't work for you, here are other alternatives:

### Alternative 2: Use EmailJS with Different Service Accounts
- Create multiple EmailJS accounts
- Use different service IDs for different email types
- Each account gets its own template limit

### Alternative 3: Use a Different Email Service

#### Option A: SendGrid
```bash
npm install @sendgrid/mail
```

#### Option B: Nodemailer (requires backend)
```bash
npm install nodemailer
```

#### Option C: Resend
```bash
npm install resend
```

### Alternative 4: Use Supabase Edge Functions
Since you're already using Supabase, create edge functions for email sending:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"

serve(async (req) => {
  const { emailType, data } = await req.json()
  
  const client = new SmtpClient()
  
  // Configure SMTP settings
  await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 587,
    username: Deno.env.get("SMTP_USERNAME"),
    password: Deno.env.get("SMTP_PASSWORD"),
  })
  
  // Send email based on type
  // ... email sending logic
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

### Alternative 5: Use a Third-Party Email API

#### Option A: Mailgun
```bash
npm install mailgun.js
```

#### Option B: AWS SES
```bash
npm install @aws-sdk/client-ses
```

## Recommended Approach

For your current setup, I recommend **Alternative 1 (Single Template)** because:

1. ✅ No additional dependencies
2. ✅ Works within EmailJS limits
3. ✅ Maintains existing code structure
4. ✅ Easy to implement and maintain
5. ✅ Professional-looking emails

## Testing the Single Template

Use the existing `EmailTest` component to test all email types with the single template approach.

## Migration Steps

1. Create the single template in EmailJS
2. Update the configuration file
3. Test with the EmailTest component
4. Verify all email types work correctly
5. Deploy to production

The single template approach will solve your template limit issue while maintaining all the functionality you need. 