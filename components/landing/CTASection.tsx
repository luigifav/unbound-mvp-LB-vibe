"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { t } from "@/lib/landing/translations";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,34,213,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-2xl mx-auto text-center relative px-6 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] rounded-full px-3.5 py-1.5">
          <span className="font-bold text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
            Comece agora
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {t("cta.title")}
        </h2>

        <p className="text-gray-500 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
          {t("cta.subtitle")}
        </p>

        <div className="flex gap-4 flex-col sm:flex-row items-center">
          <Link
            href="/register"
            className="py-4 px-8 bg-[#7c22d5] hover:bg-[#6a1cb8] rounded-xl text-white font-black text-[15px] tracking-wide no-underline transition-all duration-200 flex items-center gap-2 group hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-12px_rgba(124,34,213,0.35)]"
          >
            {t("cta.button")}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/login"
            className="py-4 px-8 bg-transparent border border-gray-200 hover:border-gray-400 rounded-xl text-gray-600 hover:text-gray-900 font-bold text-[15px] no-underline transition-all duration-200"
          >
            Ja tenho conta
          </Link>
        </div>

        <p className="text-gray-400 text-xs font-bold tracking-wider uppercase mt-2">
          Cadastro gratuito &middot; Sem compromisso &middot; Cancele quando quiser
        </p>
      </div>
    </section>
  );
}
