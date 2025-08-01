# Implementation Steps - Single Template Solution

## Quick Implementation Guide

Since you've reached the EmailJS template limit, follow these steps to implement the single template solution:

## Step 1: Create Single Template in EmailJS

1. **Go to EmailJS Dashboard**
   - Login to your EmailJS account
   - Go to "Email Templates"

2. **Create New Template**
   - Click "Create New Template"
   - **Template ID**: `template_universal`
   - **Subject**: `{{subject}}`

3. **Copy Template Content**
   - Copy the HTML template from `SINGLE_TEMPLATE_GUIDE.md`
   - Paste it into the EmailJS template editor
   - Save the template

## Step 2: Update Configuration

1. **Open `src/lib/emailConfig.ts`**
2. **Replace the template configuration:**

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id', // Your EmailJS service ID
  USER_ID: 'your_actual_user_id', // Your EmailJS public key
  TEMPLATES: {
    UNIVERSAL: 'template_universal',
  }
};
```

## Step 3: Test the System

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Add EmailTest component to a route** (temporarily):
   ```typescript
   // In your App.tsx or a test page
   import EmailTest from '@/components/EmailTest';
   
   // Add to your routes
   <Route path="/email-test" element={<EmailTest />} />
   ```

3. **Test each email type:**
   - Navigate to `/email-test`
   - Update test data with real email addresses
   - Click each test button
   - Check your email inbox

## Step 4: Verify Production Flow

1. **Test blog submission:**
   - Submit a test blog post
   - Verify confirmation email is sent
   - Check admin receives notification

2. **Test admin actions:**
   - Approve/reject a test submission
   - Verify author receives appropriate email

## Alternative Solutions (If Single Template Doesn't Work)

### Option 1: Multiple EmailJS Accounts
- Create 2-3 EmailJS accounts
- Use different service IDs for different email types
- Each account gets its own template limit

### Option 2: Use SendGrid
```bash
npm install @sendgrid/mail
```

### Option 3: Use Supabase Edge Functions
- Create edge functions for email sending
- Use SMTP or email APIs
- More control but requires backend setup

## Troubleshooting

### Common Issues:

1. **"Template not found"**
   - Verify template ID is exactly `template_universal`
   - Check template is published in EmailJS

2. **"Service ID not found"**
   - Verify your EmailJS service ID
   - Ensure email service is configured

3. **Emails not sending**
   - Check browser console for errors
   - Verify EmailJS account has credits
   - Check email service configuration

4. **Template variables not working**
   - Ensure all variables are passed correctly
   - Check template syntax in EmailJS

## Quick Test Checklist

- [ ] Single template created in EmailJS
- [ ] Configuration updated with real credentials
- [ ] Test emails sent successfully
- [ ] All email types working
- [ ] Actual submission flow tested
- [ ] Admin approval/rejection tested

## Benefits of Single Template Approach

✅ **Solves template limit issue**
✅ **Maintains all functionality**
✅ **Professional email design**
✅ **Easy to maintain**
✅ **No additional dependencies**
✅ **Works with existing code**

The single template solution will resolve your EmailJS template limit while providing all the email notification functionality you need. 