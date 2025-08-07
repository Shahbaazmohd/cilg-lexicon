@echo off
echo Creating backup of email service features...

REM Create backup directory
mkdir email-features-backup

REM Copy email service files
copy "src\lib\emailService.ts" "email-features-backup\"
copy "src\lib\emailServiceAlternative.ts" "email-features-backup\"
copy "src\lib\emailServiceTest.ts" "email-features-backup\"

REM Copy email service components
copy "src\components\EmailTest.tsx" "email-features-backup\"

REM Copy email service documentation
copy "EMAIL_SERVICE_COMPLETE.md" "email-features-backup\"
copy "EMAIL_SERVICE_SETUP.md" "email-features-backup\"
copy "EMAIL_SERVICE_IMPLEMENTATION.md" "email-features-backup\"
copy "env.example" "email-features-backup\"

REM Copy Supabase Edge Function
copy "supabase\functions\send-email\index.ts" "email-features-backup\"

echo Backup completed! Files saved in email-features-backup folder
pause
