@echo off
echo Restoring email service features...

REM Restore email service files
copy "email-features-backup\emailService.ts" "src\lib\"
copy "email-features-backup\emailServiceAlternative.ts" "src\lib\"
copy "email-features-backup\emailServiceTest.ts" "src\lib\"

REM Restore email service components
copy "email-features-backup\EmailTest.tsx" "src\components\"

REM Restore email service documentation
copy "email-features-backup\EMAIL_SERVICE_COMPLETE.md" "."
copy "email-features-backup\EMAIL_SERVICE_SETUP.md" "."
copy "email-features-backup\EMAIL_SERVICE_IMPLEMENTATION.md" "."
copy "email-features-backup\env.example" "."

REM Restore Supabase Edge Function
copy "email-features-backup\index.ts" "supabase\functions\send-email\"

echo Email service features restored!
pause
