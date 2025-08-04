# Email Functionality Setup Guide

## Overview
The blog submission and approval workflow includes automatic email notifications for:
1. **Submission Confirmation** - Sent to authors when they submit a blog
2. **Admin Notification** - Sent to admin when a new blog is submitted
3. **Approval Notification** - Sent to authors when their blog is approved
4. **Rejection Notification** - Sent to authors when their blog is rejected

## 🔐 Secure Email Alternatives (No Passwords Required)

### **Option 1: Resend.com (Recommended)**
**Free tier: 3,000 emails/month**

#### Setup Steps:
1. **Sign up at [resend.com](https://resend.com)**
2. **Get API key** from dashboard
3. **Set environment variable** in Supabase:
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   ```
4. **Deploy the updated function**:
   ```bash
   npx supabase functions deploy send-email
   ```

#### Advantages:
- ✅ No passwords needed
- ✅ Professional email delivery
- ✅ Free tier available
- ✅ Easy setup
- ✅ Good deliverability

---

### **Option 2: Supabase Auth Email**
**Uses Supabase's built-in email service**

#### Setup Steps:
1. **Enable email auth** in Supabase dashboard
2. **Configure email templates** in Supabase Auth settings
3. **Deploy the Supabase email function**:
   ```bash
   npx supabase functions deploy send-email-supabase
   ```
4. **No additional environment variables needed**

#### Advantages:
- ✅ No external dependencies
- ✅ Integrated with Supabase
- ✅ No passwords required
- ✅ Built-in templates

---

### **Option 3: EmailJS (Client-side)**
**No server setup required**

#### Setup Steps:
1. **Sign up at [emailjs.com](https://emailjs.com)**
2. **Create email templates** in EmailJS dashboard
3. **Get your credentials**:
   - Service ID
   - Template IDs
   - Public Key
4. **Update the client service** in `src/lib/emailServiceClient.ts`
5. **Replace the email service** in your components

#### Advantages:
- ✅ No server-side setup
- ✅ No passwords needed
- ✅ Easy to implement
- ✅ Free tier available

---

## 📧 Email Templates

### 1. Submission Confirmation Email
- **From**: CILG <noreply@cilg.org> (Resend) or noreply@cilg.org (Supabase)
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
- **Content**: Rejection notification with feedback and encouragement

## 🚀 Quick Start (Recommended: Resend.com)

### Step 1: Sign up for Resend
1. Go to [resend.com](https://resend.com)
2. Create free account
3. Get your API key

### Step 2: Configure Supabase
1. Go to Supabase Dashboard → Settings → Edge Functions
2. Add environment variable:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

### Step 3: Deploy Function
```bash
npx supabase functions deploy send-email
```

### Step 4: Test
1. Start your dev server: `npm run dev`
2. Go to `/email-test`
3. Test email functionality

## Testing the Email Functionality

### 1. Test Blog Submission
1. Go to `/submit-blog`
2. Fill out the form with test data
3. Submit the blog
4. Check that confirmation email is sent to the author
5. Check that admin notification is sent to usllscilg@gmail.com

### 2. Test Approval/Rejection
1. Go to Admin Dashboard > Blog Submissions
2. Select a pending blog
3. Click "Approve" or "Reject"
4. Add optional comments
5. Confirm the action
6. Check that appropriate email is sent to the author

## Email Service Implementation

### Files Involved:
- `src/lib/emailService.ts` - Main email service (Resend/Supabase)
- `src/lib/emailServiceClient.ts` - Client-side email service (EmailJS)
- `src/pages/SubmitBlog.tsx` - Blog submission form
- `src/pages/AdminSubmissions.tsx` - Admin approval/rejection
- `supabase/functions/send-email/index.ts` - Resend Edge function
- `supabase/functions/send-email-supabase/index.ts` - Supabase Edge function

### Key Features:
- ✅ **Dynamic Content**: All placeholders like [User's Name] and [Blog Title] are filled automatically
- ✅ **Professional Templates**: Beautiful HTML email templates with CILG branding
- ✅ **Error Handling**: Graceful handling of email failures
- ✅ **Multiple Email Types**: Different templates for different scenarios
- ✅ **Admin Comments**: Optional admin feedback included in approval/rejection emails
- ✅ **No Passwords**: Secure API-based email sending

## Troubleshooting

### Common Issues:
1. **Email not sending**: Check API keys and environment variables
2. **Authentication failed**: Verify API keys are correct
3. **Edge function not found**: Deploy the function to Supabase
4. **CORS errors**: Edge function includes proper CORS headers

### Debug Steps:
1. Check Supabase Edge Function logs
2. Verify environment variables in Supabase dashboard
3. Test API keys manually
4. Check browser console for errors

## Security Notes
- API keys are more secure than passwords
- Environment variables are encrypted in Supabase
- Email content is sanitized to prevent injection attacks
- CORS is properly configured for security
- No sensitive credentials stored in code

## Support
If you encounter issues with email functionality, check:
1. Supabase Edge Function logs
2. API key configuration
3. Environment variable setup
4. Network connectivity

## Recommendation
**Use Resend.com** - It's the most reliable, secure, and easiest to set up option that doesn't require any passwords. 