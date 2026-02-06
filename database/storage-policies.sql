-- VELUNA by SKF - Supabase Storage Bucket Policies
-- Run this after creating storage buckets in Supabase dashboard

-- =====================================================
-- STORAGE BUCKETS REQUIRED
-- =====================================================
-- 1. product-images (Public bucket)
-- 2. category-images (Public bucket)
-- 3. occasion-images (Public bucket)
-- 4. custom-candle-references (Public bucket)
-- 5. user-uploads (Private bucket)

-- =====================================================
-- PRODUCT IMAGES BUCKET POLICIES
-- =====================================================

-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- CATEGORY IMAGES BUCKET POLICIES
-- =====================================================

-- Allow public read access to category images
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

-- Allow authenticated users to upload category images
CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update category images
CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete category images
CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- OCCASION IMAGES BUCKET POLICIES
-- =====================================================

-- Allow public read access to occasion images
CREATE POLICY "Public read access for occasion images"
ON storage.objects FOR SELECT
USING (bucket_id = 'occasion-images');

-- Allow authenticated users to upload occasion images
CREATE POLICY "Authenticated users can upload occasion images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'occasion-images' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- CUSTOM CANDLE REFERENCES BUCKET POLICIES
-- =====================================================

-- Allow public read access to custom candle references
CREATE POLICY "Public read access for custom candle references"
ON storage.objects FOR SELECT
USING (bucket_id = 'custom-candle-references');

-- Allow anyone to upload custom candle reference images
CREATE POLICY "Anyone can upload custom candle references"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'custom-candle-references');

-- Allow users to view their own uploads
CREATE POLICY "Users can view own custom candle references"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'custom-candle-references' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- =====================================================
-- USER UPLOADS BUCKET POLICIES (Private)
-- =====================================================

-- Users can only access their own folder
CREATE POLICY "Users can view own uploads"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'user-uploads' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'user-uploads' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'user-uploads' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'user-uploads' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- =====================================================
-- HELPER FUNCTIONS FOR FILE MANAGEMENT
-- =====================================================

-- Function to get file extension
CREATE OR REPLACE FUNCTION get_file_extension(filename TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(SUBSTRING(filename FROM '\.([^\.]*)$'));
END;
$$ LANGUAGE plpgsql;

-- Function to validate image file types
CREATE OR REPLACE FUNCTION is_valid_image(filename TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    ext TEXT;
BEGIN
    ext := get_file_extension(filename);
    RETURN ext IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'svg');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE BUCKET CONFIGURATION NOTES
-- =====================================================

/*
To create these buckets in Supabase dashboard:

1. Go to Storage section
2. Click "Create bucket"
3. Configure each bucket:

BUCKET: product-images
- Public: YES
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

BUCKET: category-images
- Public: YES
- File size limit: 3 MB
- Allowed MIME types: image/jpeg, image/png, image/webp

BUCKET: occasion-images
- Public: YES
- File size limit: 3 MB
- Allowed MIME types: image/jpeg, image/png, image/webp

BUCKET: custom-candle-references
- Public: YES
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png, image/webp

BUCKET: user-uploads
- Public: NO
- File size limit: 10 MB
- Allowed MIME types: image/*, application/pdf

After creating buckets, run this SQL file to apply policies.
*/
