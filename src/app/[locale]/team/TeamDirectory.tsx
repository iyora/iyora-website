"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import clsx from "clsx";
import { OUR_TEAM, TeamMember } from "@/data/team";

export default function TeamDirectory() {
  const locale = useLocale();
  const isEn = locale === "en";

  const founder = OUR_TEAM.filter((m) => m.level === "founder");
  const management = OUR_TEAM.filter((m) => m.level === "management");
  const staff = OUR_TEAM.filter((m) => m.level === "team");

  // Reusable IYSA-Style Team Card Component
  const MemberCard = ({
    member,
    isTop = false,
  }: {
    member: TeamMember;
    isTop?: boolean;
  }) => (
    <div
      className={clsx(
        "group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5",
        isTop ? "w-full max-w-[280px] sm:max-w-[320px]" : "w-full"
      )}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info Container */}
        <div className="p-5 text-center">
          {/* Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-1">
            {member.name}
          </h3>

          {/* Role / Position */}
          <p className="text-xs sm:text-sm font-semibold text-primary leading-snug">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );

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
        <section className="text-center">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
              Founder
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
          </div>

          <div className="flex justify-center">
            {founder.map((member) => (
              <MemberCard key={member.id} member={member} isTop />
            ))}
          </div>
        </section>

        {/* Tree Connector */}
        <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />

        {/* LEVEL 2: MANAGEMENT */}
        <section className="text-center">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
              Management
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 max-w-2xl mx-auto">
            {management.map((member) => (
              <div key={member.id} className="w-full sm:w-[calc(50%-1rem)] max-w-[280px]">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </section>

        {/* Tree Connector */}
        <div className="w-px h-8 bg-gray-200 mx-auto -my-4" />

        {/* LEVEL 3: OPERATIONAL & PUBLICATION TEAMS */}
        <section className="text-center">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-2">
              {isEn ? "Operational & Publication Team" : "Tim Operasional & Publikasi"}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-teal mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {staff.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
