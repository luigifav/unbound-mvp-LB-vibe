// Exibição de saldo da wallet
// Mostra o saldo do usuário em destaque com suporte a estado de carregamento

interface BalanceDisplayProps {
  balance: number;
  currency: string;
  isLoading: boolean;
}

export default function BalanceDisplay({ balance, currency, isLoading }: BalanceDisplayProps) {
  // Formata o número no padrão brasileiro: 1.234,56
  const saldoFormatado = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    // Card com fundo levemente diferente do fundo da página (#000904)
    <div className="rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] p-6">
      {/* Label acima do valor em fonte menor e cor suave */}
      <p className="text-sm font-medium text-[rgba(255,255,255,0.45)] mb-3">
        Saldo disponível
      </p>

      {isLoading ? (
        // Placeholder animado enquanto o saldo está sendo carregado
        <div className="animate-pulse bg-[rgba(255,255,255,0.12)] rounded-lg h-10 w-48" />
      ) : (
        // Valor formatado com a moeda ao lado: ex. 1.234,56 USDC
        <p className="text-3xl font-black text-white tracking-tight">
          {saldoFormatado}{' '}
          <span className="text-[rgba(255,255,255,0.65)]">{currency}</span>
        </p>
      )}
    </div>
  );
}
