# Merge Instructions: Email Service Features + Latest Main Branch

## 🎯 Goal
Merge your local email service features with the latest main branch from git.

## 📋 Step-by-Step Process

### Step 1: Backup Your Email Service Features
1. **Run the backup script**:
   ```bash
   backup-email-features.bat
   ```
   This will create a backup of all email service files in `email-features-backup/`

### Step 2: Pull Latest Main Branch
1. **Open a new terminal** (to avoid git command issues)
2. **Navigate to your project**:
   ```bash
   cd E:\cilg-lexicon
   ```
3. **Pull the latest main branch**:
   ```bash
   git pull origin main
   ```

### Step 3: Restore Email Service Features
1. **Run the restore script**:
   ```bash
   restore-email-features.bat
   ```
   This will restore all email service files from backup

### Step 4: Commit Your Changes
1. **Add all files**:
   ```bash
   git add .
   ```
2. **Commit the changes**:
   ```bash
   git commit -m "feat: add comprehensive email service with Resend.com and EmailJS support"
   ```
3. **Push to main**:
   ```bash
   git push origin main
   ```

## 📁 Files That Will Be Preserved

### Email Service Core Files
- `src/lib/emailService.ts` - Main email service (Resend.com)
- `src/lib/emailServiceAlternative.ts` - Alternative service (EmailJS)
- `src/lib/emailServiceTest.ts` - Testing utilities

### Email Service Components
- `src/components/EmailTest.tsx` - Test component

### Email Service Documentation
- `EMAIL_SERVICE_COMPLETE.md` - Complete implementation guide
- `EMAIL_SERVICE_SETUP.md` - Setup instructions
- `EMAIL_SERVICE_IMPLEMENTATION.md` - Implementation details
- `env.example` - Environment variables template

### Supabase Edge Function
- `supabase/functions/send-email/index.ts` - Email sending function

## 🔧 Alternative Manual Process

If the scripts don't work, you can manually:

1. **Copy these files to a safe location**:
   - `src/lib/emailService.ts`
   - `src/lib/emailServiceAlternative.ts`
   - `src/lib/emailServiceTest.ts`
   - `src/components/EmailTest.tsx`
   - `EMAIL_SERVICE_*.md` files
   - `env.example`
   - `supabase/functions/send-email/index.ts`

2. **Pull latest main**:
   ```bash
   git pull origin main
   ```

3. **Restore the files** by copying them back to their original locations

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add email service features"
   git push origin main
   ```

## ✅ Expected Result

After completing these steps, you will have:
- ✅ Latest main branch changes
- ✅ All email service features preserved
- ✅ Complete email workflow functionality
- ✅ Professional documentation
- ✅ Both Resend.com and EmailJS options

## 🚨 Troubleshooting

### If git commands show help screen:
- Open a new terminal window
- Navigate to your project directory
- Try the commands again

### If files are missing after restore:
- Check the backup folder exists
- Manually copy files from backup to their locations
- Verify file paths are correct

### If there are merge conflicts:
- Resolve conflicts manually
- Keep your email service changes
- Test the application after merging

## 📞 Need Help?

If you encounter any issues:
1. Check the backup folder exists with all files
2. Verify file paths are correct
3. Test the email service after restoration
4. Check git status and resolve any conflicts
