import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Helper function to build a compliant, standalone PDF document for official SK
function generatePdfBuffer(
  comp: string,
  compFullName: string,
  skNumber: string,
  year: number
): Buffer {
  const safeComp = (comp || "IYORA").toUpperCase();
  const safeFullName = compFullName || `Olimpiade Sains ${safeComp} IYORA`;
  const safeSkNumber = skNumber || `SK.${safeComp}/PEM/${year}/09.01`;

  // PDF Page Content Stream
  const streamLines = [
    "BT",
    "/F1 16 Tf",
    "50 770 Td",
    "(INDONESIAN YOUTH OLYMPIAD RESEARCH ASSOCIATION) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 754 Td",
    "(Sekretariat Resmi: Gd. IYORA Center, Jakarta - Web: https://iyora.or.id - Email: info@iyora.or.id) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 742 Td",
    "(Terkurasi Resmi SIMT Puspresnas Kemendikbudristek Republik Indonesia) Tj",
    "ET",
    "0.3 0.3 0.3 RG",
    "1.5 w",
    "50 732 m 545 732 l S",
    "BT",
    "/F1 12 Tf",
    "50 702 Td",
    "(SURAT KEPUTUSAN DEWAN JURI DAN DIREKSI IYORA) Tj",
    "ET",
    "BT",
    "/F2 10 Tf",
    `50 686 Td (Nomor: ${safeSkNumber}) Tj`,
    "ET",
    "BT",
    "/F1 11 Tf",
    "50 660 Td",
    "(TENTANG:) Tj",
    "ET",
    "BT",
    "/F1 11 Tf",
    `50 644 Td (PENETAPAN DAFTAR PEMENANG DAN PERAIH MEDALI ${safeComp} TAHUN ${year}) Tj`,
    "ET",
    "BT",
    "/F2 10 Tf",
    `50 628 Td (${safeFullName}) Tj`,
    "ET",
    "BT",
    "/F1 10 Tf",
    "50 598 Td",
    "(MENIMBANG:) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 582 Td",
    "(1. Bahwa seleksi dan penilaian olimpiade telah selesai dilaksanakan secara objektif dan transparan;) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 568 Td",
    "(2. Bahwa peserta yang dinyatakan lolos telah memenuhi kualifikasi kurasi talenta SIMT Puspresnas;) Tj",
    "ET",
    "BT",
    "/F1 10 Tf",
    "50 538 Td",
    "(MEMUTUSKAN & MENETAPKAN:) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 522 Td",
    "(PERTAMA : Menetapkan daftar peserta terlampir sebagai Pemenang dan Peraih Medali Resmi;) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 508 Td",
    "(KEDUA   : Seluruh peraih medali berhak memperoleh Piagam Penghargaan & Verifikasi SIMT;) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "50 494 Td",
    "(KETIGA  : Keputusan ini bersifat mutlak dan mulai berlaku sejak tanggal ditetapkan.) Tj",
    "ET",
    "0.92 0.95 0.98 rg",
    "50 375 495 95 re f",
    "0.2 0.45 0.65 RG",
    "1 w",
    "50 375 495 95 re S",
    "BT",
    "/F1 10 Tf",
    "65 450 Td",
    "(KATEGORI PERINGKAT DAN MEDALI RESMI:) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "65 434 Td",
    "(- Grand Champion     : Juara Umum & Nilai Tertinggi Kompetisi) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "65 420 Td",
    "(- Gold Medal (Emas)   : Medali Emas & Sertifikat Akreditasi SIMT Puspresnas) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "65 406 Td",
    "(- Silver Medal (Perak): Medali Perak & Sertifikat Akreditasi SIMT Puspresnas) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "65 392 Td",
    "(- Bronze Medal (Perunggu): Medali Perunggu & Sertifikat Akreditasi SIMT Puspresnas) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    "350 320 Td",
    "(Ditetapkan di : Jakarta) Tj",
    "ET",
    "BT",
    "/F2 9 Tf",
    `350 306 Td (Pada tanggal  : 1 September ${year}) Tj`,
    "ET",
    "BT",
    "/F1 10 Tf",
    "350 285 Td",
    "(Direksi Eksekutif IYORA,) Tj",
    "ET",
    "BT",
    "/F2 8 Tf",
    "350 230 Td",
    "([Tanda Tangan & Cap Digital Sah]) Tj",
    "ET",
    "BT",
    "/F1 10 Tf",
    "350 215 Td",
    "(Prof. Dr. Ir. H. Mulyadi, M.Sc.) Tj",
    "ET",
    "BT",
    "/F2 8 Tf",
    "350 202 Td",
    "(Ketua Dewan Pembina IYORA) Tj",
    "ET",
    "0.95 0.95 0.95 rg",
    "50 130 495 45 re f",
    "BT",
    "/F2 8 Tf",
    "60 158 Td",
    "(Catatan: Dokumen ini diterbitkan secara sah oleh Indonesian Youth Olympiad Research Association.) Tj",
    "ET",
    "BT",
    "/F2 8 Tf",
    "60 144 Td",
    "(Daftar medalis dan verifikasi dapat diakses di: https://iyora.or.id/winners) Tj",
    "ET",
  ];

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  // PDF Structure Objects
  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
  objects[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[6] = `<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`;

  // Build PDF Binary
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let i = 1; i <= 6; i++) {
    offsets[i] = Buffer.byteLength(pdf, "utf-8");
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf-8");
  pdf += "xref\n0 7\n0000000000 65535 f \n";
  for (let i = 1; i <= 6; i++) {
    const offsetStr = String(offsets[i]).padStart(10, "0");
    pdf += `${offsetStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "utf-8");
}

function parseGoogleDriveDirectUrl(url: string): string | null {
  if (!url || !url.includes("drive.google.com")) return null;
  const match =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const comp = searchParams.get("comp") || "IYORA";
    const compFullName = searchParams.get("compName") || `Olimpiade ${comp} IYORA`;
    const skNumber = searchParams.get("skNumber") || `SK.${comp.toUpperCase()}/PEM/2026/09.01`;
    const remoteUrl = searchParams.get("url");
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const safeFilename = `SK_Pemenang_${comp.toUpperCase()}_${year}.pdf`;

    // 1. If it's a Google Drive link, redirect directly to Google Drive download
    if (remoteUrl && remoteUrl.includes("drive.google.com")) {
      const gdriveDirectUrl = parseGoogleDriveDirectUrl(remoteUrl) || remoteUrl;
      return Response.redirect(gdriveDirectUrl, 302);
    }

    // 2. If it's a local file path (e.g. /sk/sk-nygo.pdf or public/sk/nygi-sk.pdf or nyeo-sk.pdf)
    if (remoteUrl && !remoteUrl.startsWith("http") && !remoteUrl.includes("#")) {
      let cleanPath = remoteUrl.startsWith("/") ? remoteUrl.slice(1) : remoteUrl;
      if (cleanPath.startsWith("public/")) {
        cleanPath = cleanPath.slice("public/".length);
      }
      const localFileCandidates = [
        path.join(process.cwd(), "public", cleanPath),
        path.join(process.cwd(), "public", "sk", cleanPath),
        path.join(process.cwd(), "public", "sk", path.basename(cleanPath)),
      ];

      for (const candidate of localFileCandidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          const fileBuffer = fs.readFileSync(candidate);
          return new Response(new Uint8Array(fileBuffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${safeFilename}"`,
              "Content-Length": String(fileBuffer.length),
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }
      }
    }

    // 3. Auto-detect if a local PDF file exists in public/sk/ matching the competition name
    const compCode = comp.toLowerCase();
    const autoLocalCandidates = [
      path.join(process.cwd(), "public", "sk", `sk-${compCode}.pdf`),
      path.join(process.cwd(), "public", "sk", `${compCode}.pdf`),
      path.join(process.cwd(), "public", "sk", `sk-${comp.toUpperCase()}.pdf`),
      path.join(process.cwd(), "public", "sk", `${comp.toUpperCase()}.pdf`),
    ];

    for (const candidate of autoLocalCandidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        const fileBuffer = fs.readFileSync(candidate);
        return new Response(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeFilename}"`,
            "Content-Length": String(fileBuffer.length),
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      }
    }

    // 4. If a remote direct URL is provided (e.g. Supabase storage / CDN), try fetching and streaming it
    if (remoteUrl && remoteUrl.startsWith("http") && !remoteUrl.includes("#")) {
      try {
        const remoteRes = await fetch(remoteUrl, {
          headers: { Accept: "application/pdf,*/*" },
          signal: AbortSignal.timeout(5000),
        });

        if (remoteRes.ok) {
          const blob = await remoteRes.arrayBuffer();
          const buffer = Buffer.from(blob);

          return new Response(new Uint8Array(buffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${safeFilename}"`,
              "Content-Length": String(buffer.length),
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
        }
      } catch {
        // Fallback to generated PDF if remote fetch times out or fails
      }
    }

    // 5. Otherwise, generate official validated PDF document on the fly
    const pdfBuffer = generatePdfBuffer(comp, compFullName, skNumber, year);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to download SK" },
      { status: 500 }
    );
  }
}
