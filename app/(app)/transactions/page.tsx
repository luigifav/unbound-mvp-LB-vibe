"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Send } from "lucide-react";
import type { CompositeTransaction, CompositeTransactionStatus } from "@/types";

const statusLabel: Record<CompositeTransactionStatus, string> = {
  pending_deposit: "Aguardando Pix",
  converting:      "Processando",
  sending:         "A caminho",
  completed:       "Concluído",
  failed:          "Falhou",
  refunded:        "Reembolsado",
};

const statusStyles: Record<CompositeTransactionStatus, string> = {
  pending_deposit: "bg-yellow-500/10 text-yellow-400",
  converting:      "bg-blue-500/10 text-blue-400",
  sending:         "bg-purple-500/10 text-purple-400",
  completed:       "bg-green-500/10 text-green-400",
  failed:          "bg-red-500/10 text-red-400",
  refunded:        "bg-gray-500/10 text-gray-400",
};

function formatarData(isoString: string): string {
  const data = new Date(isoString);
  const agora = new Date();

  const mesmoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (mesmoDia(data, agora)) return `Hoje, ${hora}`;
  if (mesmoDia(data, ontem)) return `Ontem, ${hora}`;

  return data.toLocaleDateString("pt-BR") + ", " + hora;
}

export default function TransactionsPage() {
  const [transacoes, setTransacoes] = useState<CompositeTransaction[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarHistorico() {
      try {
        const resposta = await fetch("/api/transactions/history");
        if (!resposta.ok) return;
        const dados = await resposta.json();
        setTransacoes(dados.transacoes ?? []);
      } catch {
        // Falha silenciosa
      } finally {
        setCarregando(false);
      }
    }

    buscarHistorico();
  }, []);

  return (
    <div className="flex-1 bg-gray-950 px-6 py-10 md:px-12">
      {/* Cabeçalho */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-semibold text-white">Histórico de envios</h1>
        </div>

        {/* Skeleton */}
        {carregando && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!carregando && transacoes.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
            <Send className="w-10 h-10 text-gray-600" />
            <p className="text-gray-400 text-sm">
              Nenhum envio ainda. Que tal enviar agora?
            </p>
            <Link
              href="/send"
              className="mt-1 px-5 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Enviar dinheiro
            </Link>
          </div>
        )}

        {/* Lista de transações */}
        {!carregando && transacoes.length > 0 && (
          <div className="space-y-3">
            {transacoes.map((tx) => (
              <Link
                key={tx.id}
                href={`/send/${tx.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 hover:bg-gray-800/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white truncate pr-3">
                    Enviado para {tx.recipientName}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[tx.status]}`}
                  >
                    {statusLabel[tx.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    R${" "}
                    {tx.amount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    → {tx.receiverCurrency} estimado
                  </span>
                  <span className="text-xs text-gray-500 ml-3 shrink-0">
                    {formatarData(tx.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
