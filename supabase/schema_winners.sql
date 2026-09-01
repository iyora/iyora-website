-- ==============================================================================
-- SCHEMA & SINKRONISASI: Tabel Pemenang (winners) & SK Pengumuman (winner_announcements)
-- Digunakan untuk sinkronisasi hasil rekap nilai / pemenang dari Dashboard ke Website IYORA
-- Project Supabase Ref: rncldvdwrcipnlgdvcxr
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
    competition VARCHAR(50) NOT NULL, -- e.g. NYGO, IYGO, NYEO, IYEO, NYMO, IYMO, NYBO, IYBO, NYPO, IYPO, NYCO, IYCO, OS2MN, WSO, NSO, NSMO
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

-- Pastikan seluruh kolom tersedia jika tabel sebelumnya sudah dibuat
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS province TEXT NOT NULL DEFAULT '';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'Indonesia';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) NOT NULL DEFAULT 'ID';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS competition_full_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'General';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS level VARCHAR(100) NOT NULL DEFAULT 'SMA / MA / SMK';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS edition_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS edition_name VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS score VARCHAR(50) DEFAULT NULL;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS photo TEXT DEFAULT NULL;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100) DEFAULT NULL;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS simt_verified BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS special_note TEXT DEFAULT NULL;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.winners ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();

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

DROP POLICY IF EXISTS "Allow anon read published winners" ON public.winners;
CREATE POLICY "Allow anon read published winners"
ON public.winners FOR SELECT
TO anon
USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to winners" ON public.winners;
CREATE POLICY "Allow authenticated full access to winners"
ON public.winners FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to winners" ON public.winners;
CREATE POLICY "Allow service_role full access to winners"
ON public.winners FOR ALL
TO service_role
USING (true) WITH CHECK (true);


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

-- Pastikan kolom tabel SK tersedia
ALTER TABLE public.winner_announcements ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;
ALTER TABLE public.winner_announcements ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE public.winner_announcements ADD COLUMN IF NOT EXISTS edition VARCHAR(100) NOT NULL DEFAULT 'Season 2026';
ALTER TABLE public.winner_announcements ADD COLUMN IF NOT EXISTS badge VARCHAR(50) NOT NULL DEFAULT 'Terbaru';
ALTER TABLE public.winner_announcements ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;

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

DROP POLICY IF EXISTS "Allow anon read published announcements" ON public.winner_announcements;
CREATE POLICY "Allow anon read published announcements"
ON public.winner_announcements FOR SELECT
TO anon
USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to announcements" ON public.winner_announcements;
CREATE POLICY "Allow authenticated full access to announcements"
ON public.winner_announcements FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access to announcements" ON public.winner_announcements;
CREATE POLICY "Allow service_role full access to announcements"
ON public.winner_announcements FOR ALL
TO service_role
USING (true) WITH CHECK (true);


-- 3. HELPER FUNCTION: Sinkronisasi Otomatis Rekap Nilai / Registrasi ke Tabel Winners
-- Fungsi ini dapat dipanggil di Dashboard atau SQL Editor untuk menyalin peserta yang memiliki medali/nilai ke tabel winners
CREATE OR REPLACE FUNCTION public.sync_rekap_nilai_to_winners(p_event_id UUID DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    -- Jika ada tabel rekap_nilai atau registrations, salin/update ke tabel winners
    -- Contoh logika penyalinan dari registrasi berstatus selesai/lolos:
    INSERT INTO public.winners (
        event_id,
        name,
        school,
        city,
        province,
        country,
        country_code,
        competition,
        competition_full_name,
        category,
        level,
        edition_year,
        medal,
        score,
        is_published
    )
    SELECT 
        r.event_id,
        COALESCE(r.participant_name, r.team_name, 'Peserta'),
        COALESCE(r.school_name, r.institution, '—'),
        COALESCE(r.city, ''),
        COALESCE(r.province, ''),
        COALESCE(r.country, 'Indonesia'),
        COALESCE(r.country_code, 'ID'),
        COALESCE(c.short_name, 'IYORA'),
        COALESCE(c.name, 'IYORA Olympiad'),
        COALESCE(c.category, 'General'),
        COALESCE(r.level, 'SMA / MA / SMK'),
        EXTRACT(YEAR FROM CURRENT_DATE),
        CASE 
            WHEN r.rank = 1 OR r.medal = 'gold' THEN 'Gold Medal'
            WHEN r.rank = 2 OR r.medal = 'silver' THEN 'Silver Medal'
            WHEN r.rank = 3 OR r.medal = 'bronze' THEN 'Bronze Medal'
            ELSE 'Gold Medal'
        END,
        r.final_score::TEXT,
        true
    FROM public.registrations r
    JOIN public.events e ON e.id = r.event_id
    JOIN public.competitions c ON c.id = e.competition_id
    WHERE (p_event_id IS NULL OR r.event_id = p_event_id)
      AND (r.medal IS NOT NULL OR r.final_score IS NOT NULL)
    ON CONFLICT DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END;
$$;
