"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WinnersYearCards from "./WinnersYearCards";
import WinnersEventCards from "./WinnersEventCards";
import WinnersFilterGrid from "./WinnersFilterGrid";
import type { WinnerItem, WinnerAnnouncementDoc } from "@/data/dummyWinners";

interface WinnersExplorerProps {
  initialWinners: WinnerItem[];
  announcements?: WinnerAnnouncementDoc[];
}

function WinnersExplorerContent({
  initialWinners,
  announcements = [],
}: WinnersExplorerProps) {
  const searchParams = useSearchParams();

  // Ambil state awal dari URL params jika ada (misal ?year=2026&event=NSO)
  const initialYearParam = searchParams.get("year");
  const initialEventParam = searchParams.get("event") || searchParams.get("competition");

  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    if (initialYearParam) {
      const parsed = parseInt(initialYearParam, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  });

  const [selectedEvent, setSelectedEvent] = useState<string | null>(() => {
    return initialEventParam ? initialEventParam.toUpperCase() : null;
  });

  // Sinkronisasi bila pengguna menekan tombol Back / Forward di browser
  useEffect(() => {
    const y = searchParams.get("year");
    const e = searchParams.get("event") || searchParams.get("competition");
    if (y) {
      const parsed = parseInt(y, 10);
      if (!isNaN(parsed)) setSelectedYear(parsed);
    } else {
      setSelectedYear(null);
    }
    setSelectedEvent(e ? e.toUpperCase() : null);
  }, [searchParams]);

  // Update browser URL query params tanpa reload halaman
  const updateUrl = (year: number | null, event: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (year) {
      url.searchParams.set("year", String(year));
    } else {
      url.searchParams.delete("year");
    }
    if (event) {
      url.searchParams.set("event", event);
    } else {
      url.searchParams.delete("event");
      url.searchParams.delete("competition");
    }
    window.history.pushState(null, "", url.toString());
  };

  // ── Alur Navigasi ──

  // 1. Pilih Tahun -> Masuk ke Card Event
  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    setSelectedEvent(null);
    updateUrl(year, null);
    // Smooth scroll ke atas container
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // 2. Kembali ke Pilihan Tahun
  const handleBackToYears = () => {
    setSelectedYear(null);
    setSelectedEvent(null);
    updateUrl(null, null);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // 3. Pilih Event -> Masuk ke Daftar Pemenang
  const handleSelectEvent = (eventCode: string) => {
    setSelectedEvent(eventCode.toUpperCase());
    updateUrl(selectedYear || 2026, eventCode.toUpperCase());
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // 4. Kembali ke Daftar Event
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    updateUrl(selectedYear || 2026, null);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // ── Tampilan 3 Tingkat ──

  // TINGKAT 3: Daftar Pemenang Event Terpilih
  if (selectedYear !== null && selectedEvent !== null) {
    return (
      <WinnersFilterGrid
        initialWinners={initialWinners}
        announcements={announcements}
        selectedYear={selectedYear}
        selectedEventCode={selectedEvent}
        onBackToEvents={handleBackToEvents}
        onBackToYears={handleBackToYears}
      />
    );
  }

  // TINGKAT 2: Card Event dalam Tahun Terpilih
  if (selectedYear !== null) {
    return (
      <WinnersEventCards
        year={selectedYear}
        winners={initialWinners}
        announcements={announcements}
        onSelectEvent={handleSelectEvent}
        onBackToYears={handleBackToYears}
      />
    );
  }

  // TINGKAT 1: Card Tahun (Default)
  return (
    <WinnersYearCards
      winners={initialWinners}
      onSelectYear={handleSelectYear}
    />
  );
}

export default function WinnersExplorer(props: WinnersExplorerProps) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-500">
          Memuat arsip pemenang…
        </div>
      }
    >
      <WinnersExplorerContent {...props} />
    </Suspense>
  );
}
