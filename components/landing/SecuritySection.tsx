"use client";

import { DollarSign, Clock, Shield, Zap } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { t } from "@/lib/landing/translations";

const features = [
  { icon: DollarSign, key: "feature1" },
  { icon: Clock, key: "feature2" },
  { icon: Shield, key: "feature3" },
  { icon: Zap, key: "feature4" },
];

export default function SecuritySection() {
  return (
    <section id="seguranca" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] rounded-full px-3.5 py-1.5 mb-4">
            <span className="font-bold text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
              Por que escolher a Unbound
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            {t("security.title")}
          </h2>
          <p className="text-base text-white/40 max-w-2xl mx-auto font-medium">
            {t("security.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              className="group text-center hover:border-[rgba(124,34,213,0.25)] transition-all duration-300"
              spotlightColor="rgba(124, 34, 213, 0.3)"
            >
              <div className="p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.25)] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-[#7c22d5]" />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-[#9b4de0] transition-colors duration-300">
                  {t(`security.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-300">
                  {t(`security.${feature.key}.description`)}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
