# Supabase Email System Setup

This guide explains how to set up the email notification system using Supabase Edge Functions.

## Overview

The email system uses Supabase Edge Functions to send emails via SMTP, eliminating the need for external email services like EmailJS.

## Features

- ✅ **Free tier**: 500,000 invocations/month
- ✅ **No external dependencies**: Uses Deno's built-in SMTP
- ✅ **Secure**: Environment variables for credentials
- ✅ **Simple setup**: Just one Edge Function

## Setup Steps

### Step 1: Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Save the password** for Step 3

### Step 2: Deploy Edge Function

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy send-email
   ```

### Step 3: Set Environment Variables

1. **Go to Supabase Dashboard**
2. **Navigate to Settings → Edge Functions**
3. **Add environment variables**:
   - `EMAIL_USER`: `usllscilg@gmail.com`
   - `EMAIL_PASS`: Your Gmail app password

### Step 4: Test the System

1. **Submit a test blog** through your website
2. **Check email delivery** to both user and admin
3. **Verify Edge Function logs** in Supabase dashboard

## How It Works

### Email Types

1. **Submission Confirmation**: Sent to user when blog is submitted
2. **Admin Notification**: Sent to admin when new blog is submitted
3. **Approval Notification**: Sent to user when blog is approved
4. **Rejection Notification**: Sent to user when blog is rejected

### Code Structure

- **Edge Function**: `supabase/functions/send-email/index.ts`
- **Email Service**: `src/lib/emailService.ts`
- **Integration**: Uses Supabase client to invoke function

### Email Template

All emails use a single HTML template with:
- CILG branding and colors
- Article details
- Professional formatting
- Contact information

## Troubleshooting

### Common Issues

1. **Emails not sending**:
   - Check Gmail app password
   - Verify environment variables
   - Check Edge Function logs

2. **Authentication errors**:
   - Ensure 2FA is enabled
   - Regenerate app password
   - Check Gmail settings

3. **Function deployment fails**:
   - Check Supabase CLI installation
   - Verify project linking
   - Check function syntax

### Debugging

1. **Check Edge Function logs**:
   ```bash
   supabase functions logs send-email
   ```

2. **Test function locally**:
   ```bash
   supabase functions serve send-email
   ```

3. **Verify environment variables**:
   - Check Supabase dashboard
   - Ensure no typos in variable names

## Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ Environment variables are encrypted
- ✅ CORS is properly configured
- ✅ Input validation is implemented

## Cost Analysis

- **Supabase Edge Functions**: Free tier (500K invocations/month)
- **Gmail SMTP**: Free with Gmail account
- **Total cost**: $0/month

## Migration from EmailJS

This system replaces EmailJS with:
- ✅ No subscription required
- ✅ Better security
- ✅ More control over email content
- ✅ Integrated with existing Supabase infrastructure 