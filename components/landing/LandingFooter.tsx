"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Instagram } from "lucide-react";
import { t } from "@/lib/landing/translations";

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Image
              src="/images/52f83b7f-500e-4ff4-925f-aba92556f013.png"
              alt="Logotipo Unbound"
              width={120}
              height={32}
              className="max-h-8 w-auto mb-4 brightness-0"
              loading="lazy"
            />
            <p className="text-gray-400 text-sm font-medium max-w-[300px] leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-4">
              {t("footer.product")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#como-funciona"
                  className="text-sm font-medium hover:text-gray-600 transition-colors no-underline"
                >
                  {t("footer.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#seguranca"
                  className="text-sm font-medium hover:text-gray-600 transition-colors no-underline"
                >
                  {t("footer.advantages")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm font-medium hover:text-gray-600 transition-colors no-underline"
                >
                  {t("footer.faq")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{t("footer.email")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{t("footer.phone")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span className="text-sm">@unbound.cash</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-medium">
            &copy; {t("footer.rights")}
          </p>
          <div className="flex gap-6 text-xs text-gray-400 font-medium">
            <Link
              href="#"
              className="hover:text-gray-600 transition-colors no-underline"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="#"
              className="hover:text-gray-600 transition-colors no-underline"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="#"
              className="hover:text-gray-600 transition-colors no-underline"
            >
              {t("footer.support")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
