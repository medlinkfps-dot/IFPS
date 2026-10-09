-- ==============================================================================
-- Iraqi Family Physicians Society (IFPS) - Database Schema Migration
-- Designed for Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Administrative Users)
-- Links with auth.users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. CONTENT TYPES TABLE (Dynamic Sections)
-- Allows the admin to define sections (News, Events, Courses, Opportunities, etc.)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'FileText',
    is_in_nav BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_types_slug ON public.content_types(slug);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- Hierarchical / section-specific taxonomy
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type_id UUID REFERENCES public.content_types(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(content_type_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ------------------------------------------------------------------------------
-- 4. POSTS TABLE (Main Content Engine)
-- Supports news, events, courses, fellowships, announcements
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type_id UUID NOT NULL REFERENCES public.content_types(id) ON DELETE RESTRICT,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    summary_ar TEXT NOT NULL,
    summary_en TEXT,
    content_ar TEXT NOT NULL,
    content_en TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete support
);

-- Indexes for performant filtering and ordering
CREATE INDEX IF NOT EXISTS idx_posts_type_status ON public.posts(content_type_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.posts(is_pinned) WHERE is_pinned = true;

-- ------------------------------------------------------------------------------
-- 5. POST CATEGORIES RELATION (Many-to-Many)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_categories (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY(post_id, category_id)
);

-- ------------------------------------------------------------------------------
-- 6. MEDIA LIBRARY TABLE
-- Tracks files uploaded to Supabase Storage
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    alt_text TEXT,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created ON public.media(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE (Key-Value with AR/EN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value_ar TEXT,
    value_en TEXT,
    value_json JSONB,
    description TEXT,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. NAVIGATION ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_ar TEXT NOT NULL,
    label_en TEXT NOT NULL,
    path TEXT NOT NULL,
    is_external BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_navigation_order ON public.navigation_items(sort_order ASC);

-- ------------------------------------------------------------------------------
-- 9. AUDIT LOGS TABLE
-- Tracks critical administrative operations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, ARCHIVE, LOGIN
    entity_type TEXT NOT NULL, -- post, setting, category, user, section
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 10. CONTACT MESSAGES TABLE
-- Inquiries submitted from the official contact form
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages(is_read, created_at DESC);

-- ==============================================================================
-- SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- Prevent self-privilege escalation

-- CONTENT TYPES POLICIES
CREATE POLICY "Public can view active content types"
    ON public.content_types FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_editor_or_admin());

CREATE POLICY "Admins can manage content types"
    ON public.content_types FOR ALL
    TO authenticated
    USING (public.is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Public can view categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Editors/Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_editor_or_admin());

-- POSTS POLICIES
CREATE POLICY "Public can view published posts"
    ON public.posts FOR SELECT
    TO anon, authenticated
    USING (
        (status = 'published' AND published_at <= NOW() AND deleted_at IS NULL)
        OR public.is_editor_or_admin()
    );

CREATE POLICY "Editors/Admins can insert posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Editors/Admins can update posts"
    ON public.posts FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin());

CREATE POLICY "Admins can delete posts"
    ON public.posts FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- POST CATEGORIES POLICIES
CREATE POLICY "Public can view post categories"
    ON public.post_categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Editors/Admins can manage post categories"
    ON public.post_categories FOR ALL
    TO authenticated
    USING (public.is_editor_or_admin());

-- MEDIA POLICIES
CREATE POLICY "Public can view media"
    ON public.media FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Editors/Admins can upload media"
    ON public.media FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

CREATE POLICY "Admins can delete media"
    ON public.media FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- SITE SETTINGS POLICIES
CREATE POLICY "Public can view public settings"
    ON public.site_settings FOR SELECT
    TO anon, authenticated
    USING (is_public = true OR public.is_editor_or_admin());

CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_admin());

-- NAVIGATION ITEMS POLICIES
CREATE POLICY "Public can view active navigation items"
    ON public.navigation_items FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_editor_or_admin());

CREATE POLICY "Admins can manage navigation items"
    ON public.navigation_items FOR ALL
    TO authenticated
    USING (public.is_admin());

-- AUDIT LOGS POLICIES
CREATE POLICY "Only admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor_or_admin());

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can submit a contact message"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins and editors can view contact messages"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (public.is_editor_or_admin());

CREATE POLICY "Admins and editors can update contact messages"
    ON public.contact_messages FOR UPDATE
    TO authenticated
    USING (public.is_editor_or_admin());

CREATE POLICY "Admins can delete contact messages"
    ON public.contact_messages FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- AUTOMATED TRIGGERS FOR UPDATED_AT
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_site_settings_modtime
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET CONFIGURATION (media bucket)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read, Authenticated write for admins/editors
CREATE POLICY "Public can view media bucket"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload to media bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update/delete media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'media');
