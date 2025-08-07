# Email Service Implementation Guide

## Overview

The CILG Lexicon blog platform includes a comprehensive email notification system that automatically sends emails for blog submissions and approvals. The system uses **Resend.com** as the email service provider and **Supabase Edge Functions** for backend processing.

## 🚀 Current Implementation Status

✅ **FULLY IMPLEMENTED AND WORKING**

The email service is already implemented and includes:

1. **Blog Submission Confirmation** - Sent to authors when they submit a blog
2. **Admin Notification** - Sent to admin when a new blog is submitted  
3. **Approval Notification** - Sent to authors when their blog is approved
4. **Rejection Notification** - Sent to authors when their blog is rejected

## 📧 Email Service Architecture

### Frontend (React/TypeScript)
- **Location**: `src/lib/emailService.ts`
- **Purpose**: Handles email service calls and data formatting
- **Integration**: Used in `SubmitBlog.tsx` and `AdminSubmissions.tsx`

### Backend (Supabase Edge Functions)
- **Location**: `supabase/functions/send-email/index.ts`
- **Purpose**: Processes email requests and sends via Resend API
- **Provider**: Resend.com (free tier: 3,000 emails/month)

## 🔧 Setup Instructions

### 1. Resend.com Setup

1. **Sign up** at [resend.com](https://resend.com)
2. **Get API key** from your dashboard
3. **Set environment variable** in Supabase:
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   ```

### 2. Deploy Edge Function

```bash
# Deploy the email function to Supabase
npx supabase functions deploy send-email
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email Service Configuration (Resend.com)
RESEND_API_KEY=your_resend_api_key_here

# Admin Email Configuration
ADMIN_EMAIL=usllscilg@gmail.com
```

## 📋 Email Workflow

### 1. Blog Submission (`/submit-blog`)

When a user submits a blog:

1. **Database Insert**: Blog post saved to `blog_posts` table with `status: 'pending'`
2. **User Confirmation Email**: Sent to author with submission details
3. **Admin Notification Email**: Sent to admin with submission details

**Code Location**: `src/pages/SubmitBlog.tsx` (lines 150-180)

### 2. Blog Approval/Rejection (`/admin/submissions`)

When admin approves or rejects a blog:

1. **Database Update**: Blog post status updated to `'approved'` or `'rejected'`
2. **Author Notification Email**: Sent to author with approval/rejection details

**Code Location**: `src/pages/AdminSubmissions.tsx` (lines 90-120)

## 🎨 Email Templates

### 1. Submission Confirmation Email
- **From**: CILG <noreply@cilg.org>
- **To**: Author's email
- **Subject**: "Article Submission Confirmed - [Blog Title]"
- **Content**: Confirmation with article details and review timeline

### 2. Admin Notification Email
- **From**: CILG <noreply@cilg.org>
- **To**: usllscilg@gmail.com
- **Subject**: "New Article Submission - [Blog Title]"
- **Content**: Submission details for admin review

### 3. Approval Email
- **From**: CILG <noreply@cilg.org>
- **To**: Author's email
- **Subject**: "Article Approved - [Blog Title]"
- **Content**: Approval notification with publication URL and comments

### 4. Rejection Email
- **From**: CILG <noreply@cilg.org>
- **To**: Author's email
- **Subject**: "Article Review Update - [Blog Title]"
- **Content**: Rejection notification with feedback

## 🔍 Testing the Email Service

### Manual Testing

1. **Submit a test blog** at `/submit-blog`
2. **Check admin dashboard** at `/admin/submissions`
3. **Approve/reject the test blog**
4. **Verify emails** are received

### Automated Testing

Use the test function in `src/lib/emailServiceTest.ts`:

```typescript
import { testEmailService } from '@/lib/emailServiceTest';

// Run email service tests
const results = await testEmailService();
console.log('Test results:', results);
```

## 🛠️ Troubleshooting

### Common Issues

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

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check Supabase logs** for Edge Function errors
3. **Test Edge Function** directly via Supabase dashboard
4. **Verify environment variables** are set correctly

## 📊 Email Service Features

### ✅ Implemented Features

- [x] **Submission confirmation emails**
- [x] **Admin notification emails**
- [x] **Approval notification emails**
- [x] **Rejection notification emails**
- [x] **Professional HTML email templates**
- [x] **Error handling and logging**
- [x] **Environment variable configuration**
- [x] **Free tier email service (Resend.com)**

### 🔧 Technical Details

- **Email Provider**: Resend.com (3,000 emails/month free)
- **Backend**: Supabase Edge Functions
- **Frontend**: React TypeScript
- **Templates**: Inline HTML with CSS styling
- **Error Handling**: Comprehensive try-catch blocks
- **Logging**: Console logging for debugging

## 🚀 Deployment

### Production Setup

1. **Set production environment variables** in your hosting platform
2. **Deploy Edge Function** to production Supabase
3. **Update email templates** if needed
4. **Test email functionality** in production

### Environment Variables for Production

```env
RESEND_API_KEY=your_production_resend_api_key
ADMIN_EMAIL=usllscilg@gmail.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 📝 Code Structure

```
src/
├── lib/
│   ├── emailService.ts          # Main email service
│   └── emailServiceTest.ts      # Test functions
├── pages/
│   ├── SubmitBlog.tsx           # Blog submission with email
│   └── AdminSubmissions.tsx     # Admin approval with email
└── integrations/
    └── supabase/
        └── client.ts            # Supabase client

supabase/
└── functions/
    └── send-email/
        └── index.ts             # Edge Function for email sending
```

## 🎯 Summary

The email service is **fully implemented and functional**. It provides:

- ✅ **Complete email workflow** for blog submissions and approvals
- ✅ **Professional email templates** with CILG branding
- ✅ **Free email service** via Resend.com
- ✅ **Robust error handling** and logging
- ✅ **Easy configuration** via environment variables
- ✅ **Production-ready** implementation

The system is ready for use and requires only the Resend.com API key to be configured.
