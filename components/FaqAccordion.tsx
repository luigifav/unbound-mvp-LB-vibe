"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Como funciona o envio de dinheiro pela Unbound?",
    answer:
      "Você cria sua conta, escolhe o valor e a moeda de destino, e realiza o pagamento via PIX. Nós convertemos automaticamente e enviamos para o destinatário. Todo o processo é rastreável em tempo real pelo seu dashboard.",
  },
  {
    question: "Qual é a taxa de câmbio utilizada?",
    answer:
      "Utilizamos câmbio comercial em tempo real, atualizado a cada 30 segundos. Nossa taxa é significativamente mais competitiva que bancos tradicionais e casas de câmbio, sem spreads ocultos.",
  },
  {
    question: "Quanto tempo demora para o dinheiro chegar?",
    answer:
      "Transferências via PIX são processadas em minutos. Para transferências internacionais, o prazo médio é de 1 a 2 dias úteis, dependendo do país e método de pagamento do destinatário.",
  },
  {
    question: "É seguro usar a Unbound?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta, autenticação multifator e somos regulamentados. Todas as transações passam por verificação de compliance e prevenção a fraudes.",
  },
  {
    question: "Quais documentos preciso para criar minha conta?",
    answer:
      "Para pessoas físicas, basta seu CPF, dados pessoais e um endereço válido no Brasil. O cadastro é 100% digital e leva menos de 5 minutos.",
  },
  {
    question: "Existe um limite de envio?",
    answer:
      "Sim, os limites variam conforme o nível de verificação da sua conta. Contas verificadas podem enviar até R$ 50.000 por transação. Para valores maiores, entre em contato com nosso suporte.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`border rounded-xl transition-all duration-300 ${
              isOpen
                ? "bg-white/[0.04] border-[rgba(124,34,213,0.25)]"
                : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-transparent border-none"
              aria-expanded={isOpen}
            >
              <span
                className={`font-bold text-[15px] transition-colors duration-200 ${
                  isOpen ? "text-white" : "text-white/70"
                }`}
              >
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[#7c22d5] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 pb-5 pt-0 text-sm text-white/50 leading-relaxed font-medium">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
