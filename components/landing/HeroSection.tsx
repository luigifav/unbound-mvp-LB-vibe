"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RotatingText from "./RotatingText";
import FXCalculator from "./FXCalculator";
import Iridescence from "./Iridescence";
import { t } from "@/lib/landing/translations";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen py-20 lg:py-32 overflow-hidden">
      {/* Iridescence background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Iridescence
          color={[0.5, 0.1, 0.8]}
          mouseReact={false}
          amplitude={0.1}
          speed={0.5}
        />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[radial-gradient(ellipse,rgba(124,34,213,0.15)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 -right-20 w-96 h-96 bg-[radial-gradient(ellipse,rgba(124,34,213,0.08)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-white/[0.04] backdrop-blur-md border border-white/10 px-4 py-2 rounded-full lp-fade-in-scale overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:lp-shimmer before:translate-x-[-100%]">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#7c22d5] border-2 border-white/80 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">U1</span>
                  </div>
                  <div className="w-6 h-6 -ml-2 rounded-full bg-[#9b4de0] border-2 border-white/80 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">U2</span>
                  </div>
                  <div className="w-6 h-6 -ml-2 rounded-full bg-[#6a1cb8] border-2 border-white/80 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">U3</span>
                  </div>
                </div>
                <span className="text-sm text-white/70 font-medium">
                  400+ {t("hero.customers")}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight lp-fade-in-up">
                {t("hero.title")}{" "}
                <RotatingText
                  words={[
                    t("hero.rotating.fast"),
                    t("hero.rotating.cheap"),
                    t("hero.rotating.easy"),
                    t("hero.rotating.secure"),
                  ]}
                  className="normal-case"
                />
              </h1>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lp-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-gray-900 text-lg px-8 py-4 rounded-full font-bold no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-12px_rgba(124,34,213,0.25)] group"
              >
                {t("hero.cta")}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("como-funciona")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center bg-white/[0.04] backdrop-blur-md border border-white/10 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:lp-shimmer before:translate-x-[-100%]"
              >
                {t("nav.howItWorks")}
              </button>
            </div>
          </div>

          {/* Calculator */}
          <div className="lp-slide-in-right">
            <FXCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
