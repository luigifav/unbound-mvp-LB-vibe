"use client";

import ScrollReveal from "@/components/ScrollReveal";

const FAQ_ITEMS = [
  {
    q: "O que é a Unbound?",
    a: "A Unbound é uma plataforma de câmbio digital que permite enviar e receber dólares com taxas até 10x menores que bancos tradicionais, sem IOF e sem burocracia.",
  },
  {
    q: "Quanto tempo demora a transferência?",
    a: "A maioria das transferências é processada em minutos. Em casos excepcionais, pode levar até algumas horas.",
  },
  {
    q: "A Unbound é segura?",
    a: "Sim. Utilizamos criptografia de ponta a ponta, parceiros regulados e compliance rigoroso para garantir a segurança de todas as operações.",
  },
  {
    q: "Qual o valor mínimo de envio?",
    a: "O valor mínimo é de R$ 100 ou US$ 20 por operação.",
  },
  {
    q: "Preciso ter conta nos EUA?",
    a: "Não. A Unbound cuida de tudo. Basta criar sua conta e começar a operar.",
  },
  {
    q: "A Unbound cobra IOF?",
    a: "Não. A operação é estruturada de forma que não incide IOF para o cliente.",
  },
  {
    q: "Quais moedas são suportadas?",
    a: "Atualmente suportamos BRL ↔ USD. Estamos expandindo para EUR, GBP e outras moedas em breve.",
  },
];

export default function FaqAccordion() {
  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-3">
      {FAQ_ITEMS.map((item, i) => (
        <ScrollReveal key={i} delay={i * 50}>
          <details
            className="bg-white border border-[#e8e0f0] rounded-2xl overflow-hidden transition-all duration-300 group hover:border-[rgba(149,35,239,0.25)] open:border-[rgba(149,35,239,0.3)] open:shadow-[0_4px_16px_rgba(149,35,239,0.06)]"
          >
            <summary className="flex justify-between items-center py-5 px-6 text-base font-semibold cursor-pointer select-none list-none transition-colors hover:text-[#9523ef] [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="text-[22px] font-light text-[#9523ef] transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p
              className="px-6 pb-5 text-[15px] leading-[1.7] text-[#52525b]"
              style={{ animation: "fadeUp 0.3s ease forwards" }}
            >
              {item.a}
            </p>
          </details>
        </ScrollReveal>
      ))}
    </div>
  );
}
