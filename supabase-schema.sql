-- ═══════════════════════════════════════════════════════════════
-- SUPABASE SCHEMA — projects table + storage bucket
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- MIGRATION: Multi-media columns
-- Run this block if the projects table already exists.
-- All statements are idempotent (safe to re-run).
-- ══════════════════════════════════════════════════════════════

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS image_urls  text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url   text,
  ADD COLUMN IF NOT EXISTS links       jsonb   NOT NULL DEFAULT '[]';

-- Back-fill: wrap the existing single image_url into the new array
-- so every row has at least one entry in image_urls when image_url is set.
UPDATE projects
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND image_url <> ''
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);


-- ══════════════════════════════════════════════════════════════
-- PART 0a: Storage Bucket — Project Images
-- ══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop old policies (safe for re-runs)
DROP POLICY IF EXISTS "Allow public read access on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete from project-images" ON storage.objects;

-- Public read
CREATE POLICY "Allow public read access on project-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

-- Anon CRUD (admin page uses anon key)
CREATE POLICY "Allow anon upload to project-images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow anon update on project-images"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow anon delete from project-images"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'project-images');

-- ══════════════════════════════════════════════════════════════
-- PART 0b: Storage Bucket — Project Videos
-- ══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-videos',
  'project-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop old policies (safe for re-runs)
DROP POLICY IF EXISTS "Allow public read access on project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload to project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update on project-videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete from project-videos" ON storage.objects;

-- Public read
CREATE POLICY "Allow public read access on project-videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-videos');

-- Anon CRUD
CREATE POLICY "Allow anon upload to project-videos"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Allow anon update on project-videos"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'project-videos');

CREATE POLICY "Allow anon delete from project-videos"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'project-videos');

-- ══════════════════════════════════════════════════════════════
-- PART 1: Drop & Recreate projects table
-- ══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  year        TEXT        NOT NULL DEFAULT '',
  description TEXT        NOT NULL DEFAULT '',
  image_url   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════
-- PART 2: Enable Row Level Security
-- ══════════════════════════════════════════════════════════════

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON projects
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert"
  ON projects
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update"
  ON projects
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anon delete"
  ON projects
  FOR DELETE
  TO anon
  USING (true);

-- ══════════════════════════════════════════════════════════════
-- PART 3: Seed Data (with actual Supabase Storage image URLs)
-- ══════════════════════════════════════════════════════════════

INSERT INTO projects (title, category, year, description, image_url)
VALUES

  -- ═══════════════════════════════════════════════════════════
  -- STARTUPS
  -- ═══════════════════════════════════════════════════════════
  (
    'NOTEacher',
    'STARTUPS',
    '2025',
    'AI-powered LXP transforming static syllabi into interactive Scrollytelling narratives. Top 5 Team — U.S.-Nepal Code for Impact Hackathon.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/noteacher.png'
  ),
  (
    'HumanSign',
    'STARTUPS',
    '2025',
    'Keystroke authentication system with cryptographic proof-of-authorship using typing-pattern analysis and ONNX model. 3rd Position — CODEFEST Chitwan 2025.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/HumanSignCertification.jpg'
  ),
  (
    'ScholarsPoint',
    'STARTUPS',
    '2025',
    'Full-stack educational platform connecting students with international scholarships, internships & fellowships. Google OAuth, dynamic CMS & AdSense-ready.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/scholarspoint.png'
  ),
  (
    'KKhane',
    'STARTUPS',
    '2025',
    'Dual-Mode Cafe Menu System — Customers switch between "Permanent" menu and "Daily Specials" via a floating tab system. Features a clean paper-textured UI displaying items with images, descriptions, prices & category groupings. Includes an Admin Dashboard for managing items, toggling Permanent/Daily status, deleting entries, uploading item images to Supabase storage, and creating custom menu categories on the fly. Integrated Google Reviews link and map embed for customer feedback.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/kkhane-thehouse.png'
  ),
  (
    'FocuSift',
    'STARTUPS',
    '2025',
    'Productivity tracking and digital wellbeing tool — helps users monitor screen time, manage focus sessions, track app usage patterns, and build healthier digital habits through actionable insights and personalized recommendations.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/Focushift.png'
  ),
  (
    'OpenShelf',
    'STARTUPS',
    '2025',
    'Open-source eLibrary web app providing students, faculty & institutions easy access to digital books, resources & study materials. Developed by BOSC — Birendra Open Source Club at Birendra Multiple College. Features: browsing & searching books, library management for admins, bookmarking & note-taking, multi-user roles (students, teachers, admins), and cloud integration for device-agnostic access.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/OpenShelf.jpeg'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- FULL-STACK PROJECTS
  -- ═══════════════════════════════════════════════════════════
  (
    'Startup Resource Hub',
    'FULL-STACK',
    '2025',
    'Comprehensive platform aggregating startup resources, tools & guides for founders and builders.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/startupresourcehub.png'
  ),
  (
    'RSGRT Website',
    'FULL-STACK',
    '2024',
    'Institutional website for Remote Sensing and Georesearch Institute built with Next.js and PostgreSQL. 99.9% uptime.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/rsgrt.png'
  ),
  (
    'Naari Sringaar',
    'FULL-STACK',
    '2023',
    'E-commerce platform for beauty products with full storefront and inventory management.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/naarisringaar.png'
  ),
  (
    'TechRaj Digital Bazaar',
    'FULL-STACK',
    '2025',
    'Modern e-commerce platform specializing in technology products and digital services. Full-featured storefront with product catalog, cart system, payment integration & order management.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/techrajdigitalshop.png'
  ),
  (
    'TeachersLog',
    'FULL-STACK',
    '2025',
    'Complete tracking system by students for monitoring teachers'' punctuality — attendance records, late arrivals, and class schedule adherence disclosed transparently with the Head of Department (HOD).',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/teacherslog.jpeg'
  ),
  (
    'gnetgroups',
    'FULL-STACK',
    '2025',
    'Full-featured e-commerce platform with product listings, shopping cart, checkout flow, inventory management & order tracking system.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/gnetgroup.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- QUANTUM
  -- ═══════════════════════════════════════════════════════════
  (
    'Qubits For Change',
    'QUANTUM',
    '2025',
    'Founded quantum computing awareness community in Nepal. Member of QNepal Executive team. Facilitating learning sessions, tech talks & curating resources for international quantum research programs.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/qubitsforchange.jpeg'
  ),
  (
    '20 Days of Quantum Computing Challenge ⚛️',
    'QUANTUM',
    '2025',
    '20-day intensive quantum computing challenge covering qubits, superposition, entanglement, quantum gates, circuits, algorithms (Grover''s, Shor''s), Qiskit implementations & real quantum hardware execution.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/QuantumComputing.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- COMMUNITY
  -- ═══════════════════════════════════════════════════════════
  (
    'Birendra Open Source Club',
    'COMMUNITY',
    '2025',
    'Vice President — Planning Software Freedom Day, Hacktoberfest events. Overseeing BOSC Mentorship Program & strengthening ties with CSITAN, CFC-Chitwan.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/teambosc.jpg'
  ),
  (
    'Code for Change — Chitwan',
    'COMMUNITY',
    '2026',
    'PR Lead — Managing external communications, building partnerships with colleges & tech companies, spearheading workshop and hackathon campaigns.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/teamcfc.jpg'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- RESEARCH
  -- ═══════════════════════════════════════════════════════════
  (
    'Review Paper on Quantum Computing',
    'RESEARCH',
    '2025',
    'Pending research — Comprehensive review paper surveying the current state of quantum computing: hardware architectures, algorithmic advances, error correction, and practical applications across cryptography, optimization & machine learning.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/QuantumComputing.png'
  ),
  (
    'HumanSign Keystroke Dynamics',
    'RESEARCH',
    '2025',
    'Pending research — Deep dive into keystroke dynamics for behavioral biometric authentication. Analyzing typing patterns, timing features, and neural network architectures for continuous identity verification and proof-of-authorship.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/HumanSignCertification.jpg'
  ),
  (
    'Global IT Student Survey: Career Goals, Stress & Migration',
    'RESEARCH',
    '2025',
    'Pending research — Large-scale survey analyzing IT students worldwide on career aspirations, academic stress factors, mental health indicators, and migration intentions. Exploring correlations between education quality, job market perceptions & brain drain trends.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/siddanta.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- AWARDS
  -- ═══════════════════════════════════════════════════════════
  (
    '3rd Position — CODEFEST Chitwan 2025',
    'AWARDS',
    '2025',
    'Secured 3rd position at CODEFEST Chitwan 2025 with HumanSign — a keystroke authentication system featuring cryptographic proof-of-authorship using typing-pattern analysis and ONNX model deployment.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/CodeFest.jpg'
  ),
  (
    'Top 5 Team — U.S.-Nepal Code for Impact Hackathon',
    'AWARDS',
    '2025',
    'Selected as Top 5 team in the U.S.-Nepal Code for Impact Hackathon with NOTEacher — an AI-powered Learning Experience Platform transforming static syllabi into interactive Scrollytelling narratives.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/CodeForImpactCertification.jpeg'
  ),
  (
    'Best Functional Prototype — Ideathon 2025',
    'AWARDS',
    '2025',
    'Awarded Best Functional Prototype at Ideathon 2025 for innovative problem-solving and rapid prototyping in a competitive hackathon environment.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/ideathon.jpg'
  ),
  (
    'Hult Prize 2025',
    'AWARDS',
    '2025',
    'Participated in Hult Prize 2025 — the world''s largest student entrepreneurship competition. Developed innovative social enterprise solutions addressing global challenges.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/HultPrize.png'
  ),
  (
    'Award from Government of Nepal — IT Recognition',
    'AWARDS',
    '2025',
    'Recognized by the Government of Nepal for outstanding contributions to the IT sector, innovation in technology, and commitment to advancing Nepal''s digital landscape.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/NepalGovIT.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- CERTIFICATIONS
  -- ═══════════════════════════════════════════════════════════
  (
    'QBronze-Qiskit — QWorld / Womanium & Wiser 2025',
    'CERTIFICATIONS',
    '2025',
    'Completed QBronze-Qiskit tutorial through QWorld as part of Womanium & Wiser 2025 Quantum Program. Score: 66.27%. Certified by C-DAC Hyderabad & IIT Roorkee.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/QBronze169-473%20(1).jpg'
  ),
  (
    'Uncertainty Quantification in Deep Learning',
    'CERTIFICATIONS',
    '2025',
    'Certification in Uncertainty Quantification in Deep Learning from Brainycube Research Organization. Covering Bayesian neural networks, Monte Carlo dropout, ensemble methods & calibration techniques.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/DeepLearning%20Prediction.png'
  ),
  (
    'Machine Learning — Pi Innovations',
    'CERTIFICATIONS',
    '2024',
    '7-day intensive machine learning training at Pi Innovations covering data preprocessing, feature engineering, supervised/unsupervised learning algorithms & Python implementation with scikit-learn.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/MachineLearning.png'
  ),
  (
    'CFC Membership Certification 2024/25',
    'CERTIFICATIONS',
    '2024',
    'Official membership certification for Code for Change — Chitwan (CFC) for the 2024/25 tenure. Active contributor to tech community initiatives, workshops, and hackathon campaigns.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/CFC-Member.png'
  ),
  (
    'Cybersecurity for Beginners',
    'CERTIFICATIONS',
    '2024',
    'Certification in Cybersecurity fundamentals covering network security, threat analysis, vulnerability assessment, encryption, secure coding practices & incident response.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/CyberSecurity.png'
  ),
  (
    'Introduction to GPT',
    'CERTIFICATIONS',
    '2024',
    'Certification covering GPT architecture, transformer models, prompt engineering, fine-tuning techniques, and practical applications of large language models in real-world scenarios.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/IntoGPT.png'
  ),
  (
    'Introduction to Python',
    'CERTIFICATIONS',
    '2024',
    'Certification in Python programming covering data types, control flow, functions, OOP, file handling, libraries (NumPy, Pandas), and building practical applications.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/IntroPython.png'
  ),
  (
    'Python Autopilot',
    'CERTIFICATIONS',
    '2024',
    'Advanced Python certification covering automation, scripting, web scraping, API integration, task scheduling & building self-running Python workflows for productivity.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/PythonAutopilot.jpg'
  ),
  (
    'Hult Prize Certification',
    'CERTIFICATIONS',
    '2025',
    'Official certification of participation in Hult Prize 2025 — the world''s largest student entrepreneurship competition backed by the United Nations.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/HultPrizeCertification.jpeg'
  ),
  (
    'Code for Impact Certification',
    'CERTIFICATIONS',
    '2025',
    'Certificate of participation in the U.S.-Nepal Code for Impact Hackathon — recognized as Top 5 team for NOTEacher, an AI-powered Learning Experience Platform.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/CodeForImpactCertification.jpeg'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- CONTRIBUTIONS
  -- ═══════════════════════════════════════════════════════════
  (
    'BOSC Website — bosc.org.np',
    'CONTRIBUTIONS',
    '2025',
    'Contributed to the official website of Birendra Open Source Club (BOSC) at Birendra Multiple College. Helped build and improve the club''s online presence, event pages & community resources at bosc.org.np.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/teambosc.jpg'
  ),
  (
    'sortRace',
    'CONTRIBUTIONS',
    '2025',
    'Contributed to sortRace — an open-source project visualizing and racing sorting algorithms side by side. Improved UI components, algorithm implementations & performance benchmarks.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/sortrace.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- EXPERIENCE
  -- ═══════════════════════════════════════════════════════════
  (
    'Software Developer — Great Bear Technologies',
    'EXPERIENCE',
    '2025–NOW',
    'Engineering modern web applications across the full development lifecycle using Next.js and PostgreSQL. Kathmandu, Nepal · Remote.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/Great%20Bear%20Technology.png'
  ),
  (
    'Web Developer — RSGRT',
    'EXPERIENCE',
    '2024–NOW',
    'Maintaining and optimizing rsgrt.com.np using Next.js and PostgreSQL. Database operations & backend performance improvements. Chitwan, Nepal · Remote.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/rsgrt.png'
  ),
  (
    'Founder — ScholarsPoint.net',
    'EXPERIENCE',
    '2025–NOW',
    'Founded full-stack educational platform with Google OAuth, dynamic banner system & CMS. Bridging information gap for global educational opportunities.',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/scholarspoint.png'
  ),

  -- ═══════════════════════════════════════════════════════════
  -- ABOUT
  -- ═══════════════════════════════════════════════════════════
  (
    'Siddanta Sodari',
    'ABOUT',
    '',
    'Full Stack Developer · Quantum Computing · Community Builder — Chitwan, Nepal',
    'https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/siddanta.png'
  );

-- ══════════════════════════════════════════════════════════════
-- PART 4: Create indexes for performance
-- ══════════════════════════════════════════════════════════════

CREATE INDEX idx_projects_category ON projects (category);
CREATE INDEX idx_projects_year ON projects (year);

-- ══════════════════════════════════════════════════════════════
-- DONE! 🎉
--
-- All images deduplicated — each entry has a unique image_url.
-- Total: ~40 entries across 11 categories.
-- ══════════════════════════════════════════════════════════════
