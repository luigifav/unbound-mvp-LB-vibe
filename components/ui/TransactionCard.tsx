// Card que representa uma transação individual

import Link from 'next/link';
import StatusBadge from './StatusBadge';

// Tipos aceitos pelo componente
type TransactionType = 'payin' | 'payout';
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'processing';

interface TransactionCardProps {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string; // data em formato ISO, ex: '2026-02-25T10:30:00Z'
}

// Configuração de exibição por tipo de transação
const typeConfig: Record<TransactionType, { label: string; icon: string }> = {
  payin:  { label: 'Recebimento', icon: '↓' },
  payout: { label: 'Envio',       icon: '↑' },
};

// Componente TransactionCard: card clicável que exibe resumo de uma transação
export default function TransactionCard({ id, type, amount, currency, status, createdAt }: TransactionCardProps) {
  const { label, icon } = typeConfig[type];

  // Formata o valor monetário com duas casas decimais
  const valorFormatado = amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Formata a data para o padrão brasileiro
  const dataFormatada = new Date(createdAt).toLocaleDateString('pt-BR');

  return (
    <Link href={`/transactions/${id}`}>
      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
        {/* Linha superior: tipo à esquerda, status à direita */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <span>{icon}</span>
            <span>{label}</span>
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Linha inferior: valor e moeda à esquerda, data à direita */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            {valorFormatado} <span className="text-sm font-normal text-gray-500">{currency}</span>
          </span>
          <span className="text-xs text-gray-400">{dataFormatada}</span>
        </div>
      </div>
    </Link>
  );
}
