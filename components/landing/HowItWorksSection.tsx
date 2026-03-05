"use client";

import { ArrowRight, Smartphone, Coins, CreditCard } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { t } from "@/lib/landing/translations";

const steps = [
  { icon: Smartphone, key: "step1", color: "text-emerald-400" },
  { icon: Coins, key: "step2", color: "text-blue-400" },
  { icon: CreditCard, key: "step3", color: "text-[#7c22d5]" },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] rounded-full px-3.5 py-1.5 mb-4">
            <span className="font-bold text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
              Simples e rapido
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-base text-white/40 max-w-2xl mx-auto font-medium">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <SpotlightCard className="h-full min-h-[260px]">
                <div className="p-6 text-center">
                  <span className="font-mono text-xs font-bold text-[#7c22d5] tracking-widest mb-4 block">
                    0{index + 1}
                  </span>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.25)] mb-5">
                    <step.icon className={`h-7 w-7 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {t(`howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {t(`howItWorks.${step.key}.description`)}
                  </p>
                </div>
              </SpotlightCard>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-[#7c22d5]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
