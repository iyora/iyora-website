-- ==============================================================================
-- SCHEMA: Tabel Pemenang (winners) & SK Pengumuman (winner_announcements)
-- Digunakan untuk sinkronisasi hasil rekap nilai / pemenang dari Dashboard ke Website IYORA
-- ==============================================================================

-- 1. TABEL DAFTAR PEMENANG (winners)
CREATE TABLE IF NOT EXISTS public.winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    school TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    province TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Indonesia',
    country_code VARCHAR(10) NOT NULL DEFAULT 'ID',
    competition VARCHAR(50) NOT NULL, -- e.g. NYGO, IYGO, NYEO, IYEO, NYMO, etc.
    competition_full_name TEXT NOT NULL DEFAULT '',
    category VARCHAR(100) NOT NULL DEFAULT 'General', -- e.g. Geography, Economics, Mathematics, Biology, Physics, Chemistry, Madrasah, Science
    level VARCHAR(100) NOT NULL DEFAULT 'SMA / MA / SMK', -- e.g. SD / MI, SMP / MTs, SMA / MA / SMK, Universitas / Mahasiswa
    edition_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    edition_name VARCHAR(100) NOT NULL DEFAULT '',
    medal VARCHAR(50) NOT NULL, -- e.g. Grand Champion, Gold Medal, Silver Medal, Bronze Medal, Honorable Mention, Special Award
    score VARCHAR(50) DEFAULT NULL,
    photo TEXT DEFAULT NULL,
    certificate_number VARCHAR(100) DEFAULT NULL,
    simt_verified BOOLEAN NOT NULL DEFAULT TRUE,
    special_note TEXT DEFAULT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk mempercepat filter & pencarian di website
CREATE INDEX IF NOT EXISTS idx_winners_event ON public.winners(event_id);
CREATE INDEX IF NOT EXISTS idx_winners_competition ON public.winners(competition);
CREATE INDEX IF NOT EXISTS idx_winners_category ON public.winners(category);
CREATE INDEX IF NOT EXISTS idx_winners_level ON public.winners(level);
CREATE INDEX IF NOT EXISTS idx_winners_medal ON public.winners(medal);
CREATE INDEX IF NOT EXISTS idx_winners_is_published ON public.winners(is_published);
CREATE INDEX IF NOT EXISTS idx_winners_edition_year ON public.winners(edition_year);

-- Enable RLS & Izinkan publik melihat pemenang yang sudah di-publish
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published winners" ON public.winners;
CREATE POLICY "Allow public read published winners"
ON public.winners FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to winners" ON public.winners;
CREATE POLICY "Allow authenticated full access to winners"
ON public.winners FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to winners" ON public.winners;
CREATE POLICY "Allow service_role full access to winners"
ON public.winners FOR ALL
USING (auth.role() = 'service_role');


-- 2. TABEL DOKUMEN SK PENGUMUMAN PEMENANG (winner_announcements)
CREATE TABLE IF NOT EXISTS public.winner_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    competition VARCHAR(50) NOT NULL,
    competition_full_name TEXT NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    edition VARCHAR(100) NOT NULL DEFAULT 'Season 2026',
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sk_number VARCHAR(100) NOT NULL,
    download_url TEXT NOT NULL,
    total_participants INTEGER NOT NULL DEFAULT 0,
    total_medals INTEGER NOT NULL DEFAULT 0,
    badge VARCHAR(50) NOT NULL DEFAULT 'Terbaru',
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk SK pengumuman
CREATE INDEX IF NOT EXISTS idx_winner_announcements_event ON public.winner_announcements(event_id);
CREATE INDEX IF NOT EXISTS idx_winner_announcements_comp ON public.winner_announcements(competition);
CREATE INDEX IF NOT EXISTS idx_winner_announcements_pub ON public.winner_announcements(is_published);

-- Enable RLS & Izinkan publik membaca SK yang berstatus publish
ALTER TABLE public.winner_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published announcements" ON public.winner_announcements;
CREATE POLICY "Allow public read published announcements"
ON public.winner_announcements FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to announcements" ON public.winner_announcements;
CREATE POLICY "Allow authenticated full access to announcements"
ON public.winner_announcements FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to announcements" ON public.winner_announcements;
CREATE POLICY "Allow service_role full access to announcements"
ON public.winner_announcements FOR ALL
USING (auth.role() = 'service_role');
