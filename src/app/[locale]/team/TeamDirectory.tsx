"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import clsx from "clsx";
import { OUR_TEAM, TeamMember } from "@/data/team";

// Reusable Team Card Component
function MemberCard({
  member,
  isEn = false,
}: {
  member: TeamMember;
  isEn?: boolean;
}) {
  return (
    <div
      className={clsx(
        "group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none w-[280px] sm:w-[300px] h-full"
      )}
    >
      {/* Main Primary Photo Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 280px, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Container */}
      <div className="p-5 text-center bg-white flex-1 flex flex-col justify-center min-h-[110px]">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-1">
          {member.name}
        </h3>

        {/* Role / Position */}
        <p className="text-xs sm:text-sm font-semibold text-primary leading-snug mb-1">
          {isEn ? (member.role_en || member.role) : member.role}
        </p>

        {/* Department */}
        <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
          {isEn ? (member.department_en || member.department) : member.department}
        </p>
      </div>
    </div>
  );
}

export default function TeamDirectory() {
  const locale = useLocale();
  const isEn = locale === "en";

  const founder = OUR_TEAM.filter((m) => m.level === "founder");
  const gm = OUR_TEAM.filter((m) => m.level === "GM");
  const supervisory = OUR_TEAM.filter((m) => m.level === "CEO");
  const pm = OUR_TEAM.filter((m) => m.level === "PM");
  const operational = OUR_TEAM.filter((m) => m.level === "operational");
  const publication = OUR_TEAM.filter((m) => m.level === "publication");

  return (
    <div className="bg-[#fcfbfd] min-h-screen">
      {/* 1. HERO BANNER */}
      <section className="gradient-hero pt-36 pb-20 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-200 mb-3">
            {isEn ? "ORGANIZATION & MANAGEMENT" : "ORGANISASI & PENGURUS"}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {isEn ? "OUR TEAM" : "TIM KAMI"}
          </h1>
          <p className="text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? "Meet the dedicated leadership, management, and operational team behind IYORA."
              : "Mengenal susunan tim pimpinan, manajemen, dan divisi operasional di balik IYORA."}
          </p>
        </div>
      </section>

      {/* 2. STRUCTURE HIERARCHY SECTIONS */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* LEVEL 1: FOUNDER */}
        {founder.length > 0 && (
          <>
            <section className="text-center">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                  Founder
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
              </div>

              <div className="flex justify-center">
                {founder.map((member) => (
                  <MemberCard key={member.id} member={member} isEn={isEn} />
                ))}
              </div>
            </section>

            <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />
          </>
        )}

        {/* LEVEL 2: GENERAL MANAGER */}
        {gm.length > 0 && (
          <>
            <section className="text-center">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                  General Manager
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
              </div>

              <div className="flex justify-center">
                {gm.map((member) => (
                  <MemberCard key={member.id} member={member} isEn={isEn} />
                ))}
              </div>
            </section>

            <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />
          </>
        )}

        {/* LEVEL 3: DEWAN PENGAWAS / SUPERVISORY BOARD */}
        {supervisory.length > 0 && (
          <>
            <section className="text-center">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                  {isEn ? "Supervisory Board" : "Dewan Pengawas"}
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
              </div>

              <div className="flex justify-center">
                {supervisory.map((member) => (
                  <MemberCard key={member.id} member={member} isEn={isEn} />
                ))}
              </div>
            </section>

            <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />
          </>
        )}

        {/* LEVEL 4: PROJECT MANAGER */}
        {pm.length > 0 && (
          <>
            <section className="text-center">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                  Project Manager
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
              </div>

              <div className="flex justify-center">
                {pm.map((member) => (
                  <MemberCard key={member.id} member={member} isEn={isEn} />
                ))}
              </div>
            </section>

            <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />
          </>
        )}

        {/* LEVEL 4: OPERATIONAL TEAM (IT & ADMINISTRATION) */}
        {operational.length > 0 && (
          <>
            <section className="text-center">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                  {isEn ? "Operational Team" : "Tim Operasional"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium -mt-1 mb-2">
                  {isEn ? "IT & Administration Team" : "Tim IT & Administrasi"}
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
                {operational.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-center"
                  >
                    <MemberCard
                      member={member}
                      isEn={isEn}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />
          </>
        )}

        {/* LEVEL 5: PUBLICATION TEAM */}
        {publication.length > 0 && (
          <section className="text-center">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
                {isEn ? "Publication Team" : "Tim Publikasi"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium -mt-1 mb-2">
                {isEn ? "Promotion & Publication Team" : "Tim Promosi & Publikasi"}
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
              {publication.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-center"
                >
                  <MemberCard
                    member={member}
                    isEn={isEn}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
