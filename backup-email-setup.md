# Email Service Setup Guide

## Overview

The CILG Lexicon blog platform includes a comprehensive email notification system with **two email service options**:

1. **Resend.com** (Recommended) - Server-side email service
2. **EmailJS** (Alternative) - Client-side email service

## 🚀 Quick Setup

### Option 1: Resend.com (Recommended)

**Free tier: 3,000 emails/month**

#### Step 1: Sign up for Resend.com
1. Go to [resend.com](https://resend.com)
2. Create a free account
3. Get your API key from the dashboard

#### Step 2: Configure Environment Variables
Add to your `.env.local` file:
```env
RESEND_API_KEY=your_resend_api_key_here
```

#### Step 3: Deploy Edge Function
```bash
npx supabase functions deploy send-email
```

#### Step 4: Test the Service
1. Submit a test blog at `/submit-blog`
2. Check admin dashboard at `/admin/submissions`
3. Approve/reject the test blog
4. Verify emails are received

---

### Option 2: EmailJS (Alternative)

**Free tier: 200 emails/month**

#### Step 1: Sign up for EmailJS
1. Go to [emailjs.com](https://emailjs.com)
2. Create a free account
3. Set up email service (Gmail, Outlook, etc.)
4. Create email templates
5. Get your credentials

#### Step 2: Configure Environment Variables
Add to your `.env.local` file:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Step 3: Update Email Service
Replace the email service import in your components:
```typescript
// Instead of:
import { emailService } from '@/lib/emailService';

// Use:
import { emailServiceAlternative } from '@/lib/emailServiceAlternative';
```

---

## 📧 Email Templates

### Resend.com Templates (Built-in)

The system includes professional HTML email templates for:

1. **Submission Confirmation**
   - Sent to authors when they submit a blog
   - Includes article details and review timeline

2. **Admin Notification**
   - Sent to admin when a new blog is submitted
   - Includes submission details for review

3. **Approval Notification**
   - Sent to authors when their blog is approved
   - Includes publication URL and comments

4. **Rejection Notification**
   - Sent to authors when their blog is rejected
   - Includes feedback and suggestions

### EmailJS Templates (Custom)

Create these templates in EmailJS dashboard:

#### Template 1: Submission Confirmation
**Template ID**: `template_confirmation`
**Variables**:
- `to_email`
- `to_name`
- `article_title`
- `article_category`
- `submission_date`
- `article_prompt`

#### Template 2: Admin Notification
**Template ID**: `template_admin`
**Variables**:
- `to_email`
- `to_name`
- `author_name`
- `author_email`
- `article_title`
- `article_category`
- `submission_date`
- `article_prompt`
- `content_preview`

#### Template 3: Approval Notification
**Template ID**: `template_approval`
**Variables**:
- `to_email`
- `to_name`
- `article_title`
- `approved_date`
- `publish_url`
- `admin_comments`

#### Template 4: Rejection Notification
**Template ID**: `template_rejection`
**Variables**:
- `to_email`
- `to_name`
- `article_title`
- `review_date`
- `admin_comments`

---

## 🔧 Configuration Details

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email Service Configuration (Resend.com) - Primary Option
RESEND_API_KEY=your_resend_api_key_here

# Email Service Configuration (EmailJS) - Alternative Option
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Admin Email Configuration
ADMIN_EMAIL=usllscilg@gmail.com

# Application Configuration
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
```

### Supabase Edge Function Configuration

The Edge Function is located at `supabase/functions/send-email/index.ts` and uses Resend.com API.

To deploy:
```bash
npx supabase functions deploy send-email
```

---

## 🧪 Testing

### Manual Testing

1. **Submit a test blog** at `/submit-blog`
2. **Check admin dashboard** at `/admin/submissions`
3. **Approve/reject the test blog**
4. **Verify emails** are received

### Automated Testing

Use the test component at `/email-test` or run the test function:

```typescript
import { testEmailService } from '@/lib/emailServiceTest';

const results = await testEmailService();
console.log('Test results:', results);
```

---

## 🛠️ Troubleshooting

### Resend.com Issues

1. **Emails not sending**
   - Check `RESEND_API_KEY` is set correctly
   - Verify Edge Function is deployed
   - Check browser console for errors

2. **Edge Function errors**
   - Deploy function: `npx supabase functions deploy send-email`
   - Check Supabase dashboard for function logs

3. **Email delivery issues**
   - Verify Resend.com account is active
   - Check spam folders
   - Verify email addresses are correct

### EmailJS Issues

1. **Emails not sending**
   - Check environment variables are set correctly
   - Verify EmailJS templates are configured
   - Check browser console for errors

2. **Template errors**
   - Verify template IDs match exactly
   - Check template variables are correct
   - Test templates in EmailJS dashboard

### General Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check network tab** for failed requests
3. **Verify environment variables** are loaded correctly
4. **Test email service** directly

---

## 📊 Service Comparison

| Feature | Resend.com | EmailJS |
|---------|------------|---------|
| **Free Tier** | 3,000 emails/month | 200 emails/month |
| **Setup** | Server-side | Client-side |
| **Templates** | Built-in HTML | Custom templates |
| **Reliability** | High | Medium |
| **Customization** | High | High |
| **Cost** | Free tier available | Free tier available |

---

## 🚀 Production Deployment

### Resend.com Production Setup

1. **Set production environment variables** in your hosting platform
2. **Deploy Edge Function** to production Supabase
3. **Verify domain** in Resend.com dashboard (optional)
4. **Test email functionality** in production

### EmailJS Production Setup

1. **Set production environment variables** in your hosting platform
2. **Update EmailJS templates** for production
3. **Test email functionality** in production
4. **Monitor email delivery** in EmailJS dashboard

---

## 📝 Code Integration

### Current Implementation

The email service is already integrated in:

- `src/pages/SubmitBlog.tsx` - Blog submission with email notifications
- `src/pages/AdminSubmissions.tsx` - Admin approval with email notifications
- `src/lib/emailService.ts` - Main email service (Resend.com)
- `src/lib/emailServiceAlternative.ts` - Alternative email service (EmailJS)

### Switching Between Services

To switch from Resend.com to EmailJS:

1. **Update imports** in your components:
```typescript
// Replace this:
import { emailService } from '@/lib/emailService';

// With this:
import { emailServiceAlternative } from '@/lib/emailServiceAlternative';
```

2. **Set EmailJS environment variables**
3. **Create EmailJS templates**
4. **Test the service**

---

## 🎯 Summary

The email service is **fully implemented and ready for use**. Choose between:

- **Resend.com** (Recommended) - Professional, reliable, server-side
- **EmailJS** (Alternative) - Easy setup, client-side, good for testing

Both services provide:
- ✅ **Complete email workflow** for blog submissions and approvals
- ✅ **Professional email templates**
- ✅ **Free tier available**
- ✅ **Easy configuration**
- ✅ **Production-ready** implementation

The system is ready for immediate use once you configure your preferred email service.
