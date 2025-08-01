# Email Notification Setup Guide

This guide will help you set up email notifications for the blog submission system using EmailJS.

## Overview

The email notification system sends emails for:
1. **User Confirmation**: When a user submits a blog post
2. **Admin Notification**: When a new blog post is submitted
3. **Approval Notification**: When an admin approves a blog post
4. **Rejection Notification**: When an admin rejects a blog post

## Step 1: EmailJS Account Setup

1. Go to [EmailJS](https://www.emailjs.com/) and create an account
2. Verify your email address
3. Add a payment method (free tier available with limitations)

## Step 2: Email Service Configuration

1. In EmailJS dashboard, go to "Email Services"
2. Add a new email service (Gmail, Outlook, or custom SMTP)
3. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Email Templates Setup

Create the following email templates in EmailJS:

### Template 1: Submission Confirmation
**Template ID**: `template_submission_conf`
**Subject**: `Your article submission has been received - CILG`

**Variables to include**:
- `{{to_name}}` - Author name
- `{{article_title}}` - Article title
- `{{category}}` - Article category
- `{{submission_date}}` - Submission date
- `{{excerpt}}` - Article excerpt
- `{{admin_email}}` - Admin contact email

**Sample Template**:
```html
Dear {{to_name}},

Thank you for submitting your article "{{article_title}}" to the CILG Blog.

**Submission Details:**
- Title: {{article_title}}
- Category: {{category}}
- Submission Date: {{submission_date}}

**Article Preview:**
{{excerpt}}

Your article has been received and is currently under review. You will receive an email notification once the review process is complete.

If you have any questions, please contact us at {{admin_email}}.

Best regards,
CILG Editorial Team
```

### Template 2: Admin Notification
**Template ID**: `template_admin_notif`
**Subject**: `New blog submission received - {{article_title}}`

**Variables to include**:
- `{{author_name}}` - Author name
- `{{author_email}}` - Author email
- `{{article_title}}` - Article title
- `{{category}}` - Article category
- `{{submission_date}}` - Submission date
- `{{excerpt}}` - Article excerpt
- `{{content_preview}}` - Content preview

**Sample Template**:
```html
A new blog submission has been received:

**Author:** {{author_name}} ({{author_email}})
**Title:** {{article_title}}
**Category:** {{category}}
**Submission Date:** {{submission_date}}

**Excerpt:**
{{excerpt}}

**Content Preview:**
{{content_preview}}

Please review this submission in the admin dashboard.
```

### Template 3: Approval Notification
**Template ID**: `template_approval_notif`
**Subject**: `Your article has been approved - {{article_title}}`

**Variables to include**:
- `{{to_name}}` - Author name
- `{{article_title}}` - Article title
- `{{approval_date}}` - Approval date
- `{{publish_url}}` - Publication URL
- `{{admin_comments}}` - Admin comments (optional)

**Sample Template**:
```html
Dear {{to_name}},

Great news! Your article "{{article_title}}" has been approved for publication.

**Approval Details:**
- Approval Date: {{approval_date}}
- Publication URL: {{publish_url}}

{{#if admin_comments}}
**Editorial Comments:**
{{admin_comments}}
{{/if}}

Your article will be published shortly. Thank you for contributing to the CILG Blog!

Best regards,
CILG Editorial Team
```

### Template 4: Rejection Notification
**Template ID**: `template_rejection_notif`
**Subject**: `Article submission update - {{article_title}}`

**Variables to include**:
- `{{to_name}}` - Author name
- `{{article_title}}` - Article title
- `{{rejection_date}}` - Rejection date
- `{{admin_comments}}` - Admin feedback (optional)
- `{{contact_email}}` - Contact email

**Sample Template**:
```html
Dear {{to_name}},

Thank you for submitting your article "{{article_title}}" to the CILG Blog.

After careful review, we regret to inform you that we are unable to accept your article for publication at this time.

**Review Date:** {{rejection_date}}

{{#if admin_comments}}
**Editorial Feedback:**
{{admin_comments}}
{{/if}}

We encourage you to consider our feedback and submit revised work in the future. If you have any questions, please contact us at {{contact_email}}.

Thank you for your interest in contributing to the CILG Blog.

Best regards,
CILG Editorial Team
```

## Step 4: Update Configuration

1. Open `src/lib/emailConfig.ts`
2. Replace the placeholder values with your actual EmailJS credentials:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id', // Replace with your service ID
  USER_ID: 'your_actual_user_id', // Replace with your user ID
  TEMPLATES: {
    SUBMISSION_CONFIRMATION: 'template_submission_conf',
    ADMIN_NOTIFICATION: 'template_admin_notif',
    APPROVAL_NOTIFICATION: 'template_approval_notif',
    REJECTION_NOTIFICATION: 'template_rejection_notif',
  }
};

export const EMAIL_ADDRESSES = {
  ADMIN_EMAIL: 'your-admin@cilg.org', // Replace with actual admin email
  CONTACT_EMAIL: 'your-contact@cilg.org', // Replace with actual contact email
  ADMIN_NAME: 'CILG Admin'
};

export const WEBSITE_URLS = {
  BASE_URL: 'https://your-domain.com', // Replace with actual domain
  BLOG_URL: 'https://your-domain.com/blog', // Replace with actual blog URL
  CONTACT_URL: 'https://your-domain.com/contact'
};
```

## Step 5: Test the System

1. Start your development server
2. Submit a test blog post
3. Check that confirmation emails are sent
4. Test admin approval/rejection with email notifications

## Troubleshooting

### Common Issues:

1. **"Service ID not found"**
   - Verify your EmailJS service ID is correct
   - Ensure the email service is properly configured

2. **"Template not found"**
   - Check that template IDs match exactly
   - Verify templates are published in EmailJS

3. **"User ID not found"**
   - Verify your EmailJS user ID is correct
   - Check that your account is active

4. **Emails not sending**
   - Check browser console for errors
   - Verify EmailJS account has sufficient credits
   - Check email service configuration

### EmailJS Limits:
- Free tier: 200 emails/month
- Paid plans: Higher limits available
- Monitor usage in EmailJS dashboard

## Security Notes

1. Never commit actual EmailJS credentials to version control
2. Use environment variables for production
3. Consider rate limiting for email sending
4. Validate email addresses before sending

## Environment Variables (Recommended for Production)

Create a `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_USER_ID=your_user_id
VITE_ADMIN_EMAIL=admin@cilg.org
VITE_CONTACT_EMAIL=contact@cilg.org
```

Then update `emailConfig.ts` to use environment variables:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_your_service_id',
  USER_ID: import.meta.env.VITE_EMAILJS_USER_ID || 'your_user_id',
  // ... rest of config
};
```

## Support

If you encounter issues:
1. Check EmailJS documentation
2. Review browser console for errors
3. Verify all configuration values
4. Test with EmailJS playground 