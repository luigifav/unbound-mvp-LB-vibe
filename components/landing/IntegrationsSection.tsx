"use client";

import Image from "next/image";
import { t } from "@/lib/landing/translations";

const partnerLogos = [
  { name: "Nomad", logo: "/images/9526786b-2fa5-46a7-bb4c-6f0590e011bf.png" },
  { name: "Wise", logo: "/images/8719436b-a535-4ddd-87ed-0ff839d2fdfe.png" },
  { name: "Inter", logo: "/images/b8680e90-48e0-4272-8f01-829a480d2fcb.png" },
  { name: "Avenue", logo: "/images/146f37ce-5641-4a20-a098-d9b80bcd89f1.png" },
  { name: "C6", logo: "/images/51913c41-e297-4f9c-a9bc-d1353183d96e.png" },
];

export default function IntegrationsSection() {
  const allLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="relative py-12 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <p className="text-base font-medium text-gray-400">
            {t("integrations.title")}
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex lp-marquee items-center gap-12 whitespace-nowrap">
            {allLogos.map((partner, index) => (
              <div key={`${partner.name}-${index}`} className="flex-shrink-0">
                <div className="h-12 w-32 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    width={128}
                    height={48}
                    className="h-full w-full object-contain brightness-0 opacity-30 hover:opacity-60 transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
