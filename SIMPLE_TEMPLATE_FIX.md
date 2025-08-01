# Simple Template Fix

The email is being delivered but shows "Template: One or more dynamic variables are corrupted". This means the template variables don't match what we're sending.

## Step 1: Update EmailJS Template

Go to your EmailJS dashboard and update the `template_universal` template:

### Template Content (Simple Version):
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
        
        <!-- Simple Content -->
        <h2 style="color: #1e40af; margin-bottom: 20px;">{{email_type}}</h2>
        
        <p>Hello {{to_name}},</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #1e40af;">Details:</h3>
            <ul style="margin: 10px 0;">
                <li><strong>Article Title:</strong> {{article_title}}</li>
                <li><strong>Category:</strong> {{category}}</li>
                <li><strong>Date:</strong> {{submission_date}}</li>
            </ul>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1e40af;">Preview:</h4>
            <p style="margin: 0; font-style: italic;">{{excerpt}}</p>
        </div>
        
        <p>This is a test email from the CILG Blog system.</p>
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
            <p style="margin: 0;">Best regards,<br><strong>CILG Editorial Team</strong></p>
        </div>
        
    </div>
</body>
</html>
```

### Template Variables to Include:
Make sure these variables are defined in your EmailJS template:
- `{{subject}}`
- `{{email_type}}`
- `{{to_name}}`
- `{{article_title}}`
- `{{category}}`
- `{{submission_date}}`
- `{{excerpt}}`

## Step 2: Alternative - Use Even Simpler Template

If the above still doesn't work, use this minimal template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1>CILG Blog Test Email</h1>
    <p>Hello {{to_name}},</p>
    <p>This is a test email for article: <strong>{{article_title}}</strong></p>
    <p>Category: {{category}}</p>
    <p>Date: {{submission_date}}</p>
    <p>Preview: {{excerpt}}</p>
    <p>Best regards,<br>CILG Team</p>
</body>
</html>
```

## Step 3: Test Again

After updating the template:

1. **Go to**: `http://localhost:8082/simple-email-test`
2. **Enter your email address**
3. **Send test email**
4. **Check the result**

## Step 4: If Still Not Working

If you still get corrupted variables, try this approach:

1. **Create a completely new template** in EmailJS
2. **Use a simple ID** like `template_test`
3. **Update the configuration**:

```typescript
// In src/lib/emailConfig.ts
TEMPLATES: {
  UNIVERSAL: 'template_test', // Use your new template ID
}
```

## Common Template Issues:

1. **Variable names don't match** - Ensure template variables exactly match what we're sending
2. **Special characters** - Avoid special characters in variable names
3. **Template not saved** - Make sure to save the template in EmailJS dashboard
4. **Template not published** - Ensure template is published

Try the simple template first and let me know if it works! 