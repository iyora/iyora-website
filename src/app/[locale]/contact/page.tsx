"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";

interface FormState {
  name: string;
  email: string;
  institution: string;
  purpose: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  institution: "",
  purpose: "",
  message: "",
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Simulate network request — replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSending(false);
    setSuccess(true);
    setForm(INITIAL_FORM);
  };

  const purposes = [
    { value: "info", label: t("purpose_info") },
    { value: "partner", label: t("purpose_partner") },
    { value: "media", label: t("purpose_media") },
    { value: "other", label: t("purpose_other") },
  ];

  const inputBase =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 bg-white";

  const labelBase = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("title")}</h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto opacity-90">
          {t("subtitle")}
        </p>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 items-start">
          {/* Contact Info Sidebar */}
          <aside className="space-y-8">
            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-primary mb-1">{t("our_email")}</h3>
              <p className="text-gray-500 text-sm">info@iyora.or.id</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-teal mb-1">{t("location")}</h3>
              <p className="text-gray-500 text-sm">Jl. Kemang, Pasir Putih, Kecamatan. Sawangan, Kota Depok, Jawa Barat 16519</p>
            </div>
            {/* IYORA brand accent */}
            <div className="rounded-2xl gradient-hero p-6 text-white">
              <p className="font-bold text-sm mb-1">IYORA</p>
              <p className="text-xs opacity-80 leading-relaxed">
                Indonesian Youth Outstanding Recognition Association
              </p>
            </div>
          </aside>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-teal"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {t("success")}
                </h3>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-sm text-teal underline underline-offset-4"
                >
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelBase}>
                      {t("name")} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      {t("email")} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                {/* Institution + Purpose */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="institution" className={labelBase}>
                      {t("institution")}
                    </label>
                    <input
                      id="institution"
                      name="institution"
                      type="text"
                      value={form.institution}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="Sekolah / Universitas / Lembaga"
                    />
                  </div>
                  <div>
                    <label htmlFor="purpose" className={labelBase}>
                      {t("purpose")} <span className="text-accent">*</span>
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      required
                      value={form.purpose}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="" disabled>
                        Pilih keperluan...
                      </option>
                      {purposes.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelBase}>
                    {t("message")} <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputBase} resize-none`}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/25"
                >
                  {sending ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
