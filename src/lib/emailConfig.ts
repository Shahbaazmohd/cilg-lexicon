// EmailJS Configuration
// IMPORTANT: Replace the placeholder values below with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (found in EmailJS dashboard → Email Services)
  // Replace 'service_your_service_id' with your actual service ID (e.g., 'service_abc123')
  SERVICE_ID: 'service_d8xjoac',
  
  // Your EmailJS User ID (found in EmailJS dashboard → Account → API Keys → Public Key)
  // Replace 'your_user_id' with your actual public key
  USER_ID: 'fclnAu6OoVdkrEii4',
  
  // Template ID for universal email template
  TEMPLATES: {
    // Universal template that handles all email types
    // Make sure you've created this template in EmailJS dashboard
    UNIVERSAL: 'template_universal',
  }
};

// Email addresses
export const EMAIL_ADDRESSES = {
  // Admin email address for notifications
  // Replace with your actual admin email
  ADMIN_EMAIL: 'admin@cilg.org',
  
  // Contact email for authors to reach out
  // Replace with your actual contact email
  CONTACT_EMAIL: 'admin@cilg.org',
  
  // From name for admin emails
  ADMIN_NAME: 'CILG Admin'
};

// Website URLs
export const WEBSITE_URLS = {
  // Base URL for the website
  // Replace with your actual domain
  BASE_URL: 'https://cilg.org',
  
  // Blog URL where approved articles will be published
  // Replace with your actual blog URL
  BLOG_URL: 'https://cilg.org/blog',
  
  // Contact page URL
  // Replace with your actual contact page URL
  CONTACT_URL: 'https://cilg.org/contact'
};

// Email template variables reference for universal template
export const EMAIL_TEMPLATE_VARIABLES = {
  // Universal template variables (used for all email types)
  UNIVERSAL: {
    // Common variables
    email_type: 'Type of email (confirmation, admin, approval, rejection)',
    subject: 'Email subject line',
    current_date: 'Current date',
    admin_email: 'Admin contact email',
    contact_email: 'Contact email for questions',
    admin_name: 'Admin name',
    blog_url: 'Blog URL',
    base_url: 'Base website URL',
    
    // User confirmation email variables
    to_email: 'Recipient email address',
    to_name: 'Recipient name',
    article_title: 'Title of the article',
    category: 'Article category',
    submission_date: 'Date of submission',
    excerpt: 'Article excerpt or preview',
    
    // Admin notification variables
    author_name: 'Author name',
    author_email: 'Author email address',
    content_preview: 'First 500 characters of article content',
    
    // Approval/rejection variables
    approval_date: 'Date of approval',
    rejection_date: 'Date of rejection',
    publish_url: 'URL where the article will be published',
    admin_comments: 'Optional comments from admin'
  }
}; 