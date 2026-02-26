// Badge de status das transações

// Tipos de status possíveis para uma transação
type Status = 'pending' | 'completed' | 'failed' | 'processing';

interface StatusBadgeProps {
  status: Status;
}

// Mapeamento de cada status para texto em português e classes Tailwind
const config: Record<Status, { label: string; classes: string }> = {
  pending:    { label: 'Pendente',     classes: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  completed:  { label: 'Concluído',    classes: 'bg-green-100  text-green-700  border-green-300'  },
  failed:     { label: 'Falhou',       classes: 'bg-red-100    text-red-700    border-red-300'    },
  processing: { label: 'Processando',  classes: 'bg-blue-100   text-blue-700   border-blue-300'   },
};

// Componente StatusBadge: pill colorido que indica o estado da transação
export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${classes}`}>
      {label}
    </span>
  );
}
