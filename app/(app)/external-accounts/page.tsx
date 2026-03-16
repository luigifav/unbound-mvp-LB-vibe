'use client';

// Página de gerenciamento de contas externas
// Permite cadastrar e visualizar contas para: PIX, SPEI, WIRE, SEPA

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  CreditCard,
  Trash2,
  X,
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PaymentRail = 'PIX' | 'SPEI' | 'WIRE' | 'SEPA';

interface ExternalAccount {
  id: string;
  rail: PaymentRail;
  currency: string;
  beneficiaryName: string;
  pixKey?: string;
  document?: string;
  bankCode?: string;
  clabe?: string;
  routingNumber?: string;
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  bic?: string;
  country?: string;
  createdAt: string;
}

// ─── Rótulos por rail ─────────────────────────────────────────────────────────

const RAIL_LABELS: Record<PaymentRail, { label: string; color: string; currency: string }> = {
  PIX: { label: 'PIX', color: 'bg-green-500/10 text-green-400', currency: 'BRL' },
  SPEI: { label: 'SPEI', color: 'bg-blue-500/10 text-blue-400', currency: 'MXN' },
  WIRE: { label: 'Wire', color: 'bg-yellow-500/10 text-yellow-400', currency: 'USD' },
  SEPA: { label: 'SEPA', color: 'bg-purple-500/10 text-purple-400', currency: 'EUR' },
};

// ─── Modal de nova conta ──────────────────────────────────────────────────────

interface NewAccountModalProps {
  onClose: () => void;
  onCreated: (account: ExternalAccount) => void;
}

function NewAccountModal({ onClose, onCreated }: NewAccountModalProps) {
  const [rail, setRail] = useState<PaymentRail>('PIX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [document, setDocument] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [clabe, setClabe] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = { rail, beneficiaryName };
      if (rail === 'PIX') {
        if (!pixKey.trim() || !document.trim()) {
          setErro('Preencha a chave PIX e o documento.');
          return;
        }
        payload.pixKey = pixKey;
        payload.document = document;
      } else if (rail === 'SPEI') {
        if (!clabe.trim()) { setErro('Preencha a CLABE.'); return; }
        payload.clabe = clabe;
        if (bankCode.trim()) payload.bankCode = bankCode;
      } else if (rail === 'WIRE') {
        if (!routingNumber.trim() || !accountNumber.trim()) {
          setErro('Preencha o Routing Number e o número de conta.');
          return;
        }
        payload.routingNumber = routingNumber;
        payload.accountNumber = accountNumber;
        if (bankName.trim()) payload.bankName = bankName;
      } else if (rail === 'SEPA') {
        if (!iban.trim() || !bic.trim()) {
          setErro('Preencha o IBAN e o BIC/SWIFT.');
          return;
        }
        payload.iban = iban;
        payload.bic = bic;
        if (country.trim()) payload.country = country;
      }

      const res = await fetch('/api/external-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.mensagem ?? 'Erro ao salvar conta.');
        return;
      }

      const data = await res.json();
      onCreated(data.account);
      onClose();
    } catch {
      setErro('Erro de rede. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Nova conta externa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seleção do rail */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de pagamento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['PIX', 'SPEI', 'WIRE', 'SEPA'] as PaymentRail[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRail(r)}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    rail === r
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Nome do beneficiário */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome do beneficiário
            </label>
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Nome completo"
              className={inputClass}
              required
            />
          </div>

          {/* Campos específicos por rail */}
          {rail === 'PIX' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Chave PIX</label>
                <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">CPF / CNPJ</label>
                <input type="text" value={document} onChange={(e) => setDocument(e.target.value)} placeholder="000.000.000-00" className={inputClass} />
              </div>
            </>
          )}

          {rail === 'SPEI' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">CLABE (18 dígitos)</label>
                <input type="text" value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="000000000000000000" maxLength={18} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Código do banco (opcional)</label>
                <input type="text" value={bankCode} onChange={(e) => setBankCode(e.target.value)} placeholder="Ex: 002" className={inputClass} />
              </div>
            </>
          )}

          {rail === 'WIRE' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Routing Number (9 dígitos)</label>
                <input type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="021000021" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Número da conta</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="123456789" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome do banco (opcional)</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Chase Bank" className={inputClass} />
              </div>
            </>
          )}

          {rail === 'SEPA' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">IBAN</label>
                <input type="text" value={iban} onChange={(e) => setIban(e.target.value.toUpperCase())} placeholder="DE89370400440532013000" className={`${inputClass} font-mono`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">BIC / SWIFT</label>
                <input type="text" value={bic} onChange={(e) => setBic(e.target.value.toUpperCase())} placeholder="DEUTDEFF" className={`${inputClass} font-mono`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">País (opcional)</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="DE" maxLength={2} className={inputClass} />
              </div>
            </>
          )}

          {/* Mensagem de erro */}
          {erro && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {erro}
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !beneficiaryName.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Card de conta ────────────────────────────────────────────────────────────

function AccountCard({
  account,
  onDelete,
}: {
  account: ExternalAccount;
  onDelete: (id: string) => void;
}) {
  const { label, color } = RAIL_LABELS[account.rail];
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const handleDelete = async () => {
    setExcluindo(true);
    try {
      const res = await fetch(`/api/external-accounts/${account.id}`, { method: 'DELETE' });
      if (res.ok) onDelete(account.id);
    } finally {
      setExcluindo(false);
      setConfirmando(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{account.beneficiaryName}</p>
            <p className="text-xs text-gray-500">{account.currency}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
          {label}
        </span>
      </div>

      <div className="space-y-1.5">
        {account.pixKey && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Chave PIX</span>
            <span className="text-xs text-gray-300 font-mono truncate max-w-[160px]">{account.pixKey}</span>
          </div>
        )}
        {account.clabe && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">CLABE</span>
            <span className="text-xs text-gray-300 font-mono">{account.clabe}</span>
          </div>
        )}
        {account.accountNumber && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Conta</span>
            <span className="text-xs text-gray-300 font-mono">{account.accountNumber}</span>
          </div>
        )}
        {account.iban && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">IBAN</span>
            <span className="text-xs text-gray-300 font-mono truncate max-w-[160px]">{account.iban}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-600">
          {new Date(account.createdAt).toLocaleDateString('pt-BR')}
        </span>
        {confirmando ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Confirmar?</span>
            <button onClick={handleDelete} disabled={excluindo} className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors disabled:opacity-50">
              {excluindo ? 'Excluindo...' : 'Sim'}
            </button>
            <button onClick={() => setConfirmando(false)} className="text-xs text-gray-400 hover:text-white transition-colors">
              Não
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmando(true)} className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ExternalAccountsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<ExternalAccount[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscar() {
      try {
        const res = await fetch('/api/external-accounts');
        if (res.ok) {
          const data = await res.json();
          setAccounts(data.accounts ?? []);
        }
      } catch {
        // Erro silencioso
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, []);

  const handleCreated = (account: ExternalAccount) => {
    setAccounts((prev) => [account, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Contas externas</h1>
            <p className="text-sm text-gray-400">
              Gerencie destinatários para PIX, SPEI, Wire e SEPA
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova conta
        </button>
      </header>

      {/* Conteúdo */}
      <main className="px-8 py-6">
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-24" />
                    <div className="h-2 bg-gray-800 rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-800 rounded" />
                  <div className="h-3 bg-gray-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Nenhuma conta cadastrada
            </h2>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              Cadastre contas externas para enviar dinheiro por PIX, SPEI, Wire ou SEPA.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Cadastrar primeira conta
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {accounts.length} conta{accounts.length !== 1 ? 's' : ''} cadastrada
              {accounts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={handleDeleted}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de nova conta */}
      {modalOpen && (
        <NewAccountModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
