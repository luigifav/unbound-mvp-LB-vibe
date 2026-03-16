// Badge de status das transações — tema claro

type Status = 'pending' | 'completed' | 'failed' | 'processing';

interface StatusBadgeProps {
  status: Status;
}

const config: Record<Status, { label: string; classes: string }> = {
  pending:    { label: 'Pendente',     classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  completed:  { label: 'Concluído',    classes: 'bg-green-50  text-green-700  border-green-200'  },
  failed:     { label: 'Falhou',       classes: 'bg-red-50    text-red-700    border-red-200'    },
  processing: { label: 'Processando',  classes: 'bg-blue-50   text-blue-700   border-blue-200'   },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${classes}`}>
      {label}
    </span>
  );
}
