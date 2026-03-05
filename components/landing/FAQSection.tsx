"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { t } from "@/lib/landing/translations";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] rounded-full px-3.5 py-1.5 mb-4">
            <span className="font-bold text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
              Duvidas frequentes
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-base text-white/40 max-w-2xl mx-auto font-medium">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqKeys.map((key, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={key}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/10"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
                >
                  <span className="font-bold text-white text-sm sm:text-base pr-4">
                    {t(`faq.${key}.title`)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-white/40 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-4 text-sm text-white/45 leading-relaxed">
                      {t(`faq.${key}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
