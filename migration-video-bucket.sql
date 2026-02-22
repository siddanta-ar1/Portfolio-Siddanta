-- ═══════════════════════════════════════════════════════════════
-- MIGRATION: Video bucket + anon storage policies
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- 1. Add CRUD RLS policies for projects table (anon)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert' AND tablename = 'projects') THEN
    CREATE POLICY "Allow anon insert" ON projects FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update' AND tablename = 'projects') THEN
    CREATE POLICY "Allow anon update" ON projects FOR UPDATE TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon delete' AND tablename = 'projects') THEN
    CREATE POLICY "Allow anon delete" ON projects FOR DELETE TO anon USING (true);
  END IF;
END $$;

-- 2. Fix image bucket: allow anon uploads (admin uses anon key)
DROP POLICY IF EXISTS "Allow authenticated upload to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete from project-images" ON storage.objects;

CREATE POLICY "Allow anon upload to project-images"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow anon update on project-images"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow anon delete from project-images"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'project-images');

-- 3. Create video bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-videos',
  'project-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Video bucket policies
DROP POLICY IF EXISTS "Allow public read access on project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload to project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update on project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete from project-videos" ON storage.objects;

CREATE POLICY "Allow public read access on project-videos"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-videos');

CREATE POLICY "Allow anon upload to project-videos"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Allow anon update on project-videos"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'project-videos');

CREATE POLICY "Allow anon delete from project-videos"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'project-videos');

-- ═══════════════════════════════════════════════════════════════
-- DONE! 🎉
-- ═══════════════════════════════════════════════════════════════
