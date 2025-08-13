# Resources Storage Bucket Setup Guide

## 🚨 **Important: Manual Setup Required**

Due to Supabase security restrictions, the storage bucket must be created manually through the Supabase Dashboard. The SQL migration only handles RLS policies.

## 📋 **Step-by-Step Setup Instructions**

### **1. Access Supabase Dashboard**
- Go to your Supabase project dashboard
- Navigate to **Storage** in the left sidebar

### **2. Create Resources Bucket**
- Click **"New bucket"** button
- Fill in the following details:
  - **Name**: `resources`
  - **Public bucket**: ✅ **Check this box** (important for downloads)
  - **File size limit**: `50 MB`
  - **Allowed MIME types**: Leave empty (accepts all types)

### **3. Configure Bucket Settings**
- **Public bucket**: Must be enabled for users to download files
- **File size limit**: 50MB is sufficient for most documents
- **MIME types**: Leave unrestricted for flexibility

### **4. Run the SQL Migration**
After creating the bucket, run the SQL migration file:
```sql
-- File: supabase/migrations/20250101000011-fix-resources-storage.sql
-- This will create the necessary RLS policies
```

### **5. Verify Bucket Configuration**
- Go to **Storage > Buckets**
- Click on the `resources` bucket
- Verify:
  - ✅ **Public bucket** is enabled
  - ✅ **File size limit** is set to 50MB
  - ✅ **RLS policies** are in place

## 🔧 **Alternative: Use Existing Migration**

If you already have the `resources` bucket from the original migration, you can skip the manual creation and just run the updated SQL migration for policies.

## 📁 **What the Migration Does**

The updated migration file:
- ✅ Creates RLS policies for file access
- ✅ Allows public read access to files
- ✅ Restricts uploads/updates/deletes to admins only
- ❌ **Cannot** create or modify the storage bucket itself

## 🧪 **Testing the Setup**

### **1. Test File Upload (Admin)**
- Go to `/admin/resources`
- Try uploading a test file
- Should work without errors

### **2. Test File Download (Public)**
- Go to `/resources`
- Click download button on a resource
- File should download directly (not open in browser)

### **3. Check Console Logs**
- Open browser developer tools
- Look for download-related logs
- Should see success messages

## 🚨 **Common Issues & Solutions**

### **Issue: "Bucket not found"**
**Solution**: Ensure the bucket name is exactly `resources` (lowercase)

### **Issue: "Access denied"**
**Solution**: Verify the bucket is marked as public

### **Issue: "File too large"**
**Solution**: Check the file size limit is set to 50MB or higher

### **Issue: "Policy violation"**
**Solution**: Run the SQL migration to create proper RLS policies

## 📋 **Manual SQL Commands (if needed)**

If you prefer to run the policies manually:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resource files" ON storage.objects;

-- Create new policies
CREATE POLICY "Anyone can view resource files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resource files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Admins can update resource files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resources');

CREATE POLICY "Admins can delete resource files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resources');
```

## ✅ **Verification Checklist**

- [ ] Resources bucket created in Supabase Dashboard
- [ ] Bucket marked as public
- [ ] File size limit set to 50MB
- [ ] SQL migration run successfully
- [ ] RLS policies created
- [ ] File upload test successful
- [ ] File download test successful
- [ ] Console logs show no errors

## 🎯 **Next Steps**

1. **Create the bucket** through Supabase Dashboard
2. **Run the SQL migration** for policies
3. **Test the functionality** with file upload/download
4. **Monitor console logs** for any remaining issues

The download functionality should work perfectly once the storage bucket is properly configured!
