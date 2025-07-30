# Database Migration Setup for Featured Articles

## Issue
The featured articles functionality is currently not working because the `featured_order` field hasn't been added to the database yet.

## Solution
You need to apply the database migration manually in your Supabase dashboard.

## Steps to Apply Migration

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section

### 2. Run the Migration SQL
Copy and paste the following SQL into the SQL Editor and run it:

```sql
-- Add featured_order field to blog_posts table for reordering functionality
ALTER TABLE public.blog_posts 
ADD COLUMN featured_order INTEGER;

-- Create an index on featured_order for better performance
CREATE INDEX idx_blog_posts_featured_order ON public.blog_posts(featured_order);

-- Update existing featured posts with order values
-- This will set featured_order based on creation date (newest first)
UPDATE public.blog_posts 
SET featured_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.blog_posts 
  WHERE featured = true AND status = 'approved'
) as subquery
WHERE public.blog_posts.id = subquery.id;
```

### 3. Verify the Migration
After running the SQL, you can verify it worked by running:

```sql
-- Check if the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'featured_order';

-- Check if existing featured posts have order values
SELECT id, title, featured, featured_order 
FROM blog_posts 
WHERE featured = true 
ORDER BY featured_order;
```

## What This Migration Does

1. **Adds `featured_order` field**: Integer column to track display order
2. **Creates an index**: For better query performance
3. **Sets initial order values**: Based on creation date (newest first)

## After Migration

Once the migration is applied:
- ✅ Adding featured articles will work again
- ✅ Reordering functionality will be available
- ✅ Featured articles will display in the correct order on the homepage
- ✅ All existing featured articles will have proper order values

## Fallback Behavior

The application has been updated to handle the case where the migration hasn't been applied yet:
- Featured articles can still be added (using count-based ordering)
- Reordering will show a message about needing the migration
- The homepage will still display featured articles (ordered by creation date)

## Troubleshooting

If you encounter any issues:
1. Make sure you have admin access to the Supabase project
2. Check that the SQL executed without errors
3. Verify the column was added using the verification query above
4. Test adding a featured article in the admin dashboard

## Next Steps

After applying the migration:
1. Test adding a featured article in the admin dashboard
2. Test the reordering functionality
3. Verify featured articles display correctly on the homepage 