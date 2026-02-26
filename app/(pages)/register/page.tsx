"use client";

import { useState, useRef, type ReactNode, type CSSProperties, type InputHTMLAttributes, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/ui/LoadingButton";
import Feedback from "@/components/ui/Feedback";

// ─── Design tokens ────────────────────────────────────────────────
const C = {
  purple: "#7c22d5",
  purpleLight: "#9b4de0",
  purpleDim: "rgba(124,34,213,0.15)",
  purpleBorder: "rgba(124,34,213,0.35)",
  white: "#ffffff",
  black: "#000904",
  grayLight: "rgba(255,255,255,0.06)",
  grayBorder: "rgba(255,255,255,0.1)",
  textMuted: "rgba(255,255,255,0.45)",
  textSub: "rgba(255,255,255,0.65)",
  error: "#f06060",
  success: "#4caf82",
};

const font = "'Red Hat Display', sans-serif";

const STEPS = [
  { id: 1, label: "Pessoal" },
  { id: 2, label: "Documento" },
  { id: 3, label: "Endereço" },
  { id: 4, label: "Review" },
];

const CITIES_BY_UF: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasileia", "Epitaciolândia", "Xapuri", "Plácido de Castro", "Porto Walter"],
  AL: ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "São Miguel dos Campos", "Delmiro Gouveia", "Marechal Deodoro", "Coruripe"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Tartarugalzinho", "Pedra Branca do Amapari", "Calçoene", "Vitória do Jari"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Gabriel da Cachoeira", "Humaitá", "Borba", "Manicoré"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Petrolina", "Itabuna", "Ilhéus", "Lauro de Freitas", "Jequié", "Teixeira de Freitas", "Barreiras", "Porto Seguro", "Simões Filho", "Paulo Afonso"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Canindé", "Aquiraz", "Pacatuba"],
  DF: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Planaltina", "Gama", "Recanto das Emas", "Sobradinho", "Santa Maria", "São Sebastião"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Cachoeiro de Itapemirim", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Viana", "Nova Venécia"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Itumbiara", "Senador Canedo"],
  MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Barra do Corda", "Pedreiras"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana", "Sidrolândia", "Paranaíba", "Maracaju"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas", "Pouso Alegre", "Teófilo Otoni", "Barbacena", "Sabará", "Vespasiano"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Altamira", "Itaituba", "Redenção", "Tucuruí", "Marituba", "Abaetetuba", "Cametá", "Bragança", "Barcarena"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Sapé", "Queimadas"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo", "Almirante Tamandaré", "Umuarama", "Piraquara", "Cambé", "Fazenda Rio Grande"],
  PE: ["Recife", "Caruaru", "Olinda", "Petrolina", "Jaboatão dos Guararapes", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "Abreu e Lima", "Santa Cruz do Capibaribe", "Salgueiro", "Araripina"],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "Oeiras", "Esperantina", "Pedro II"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda", "Magé", "Itaboraí", "Macaé", "Cabo Frio", "Nova Friburgo", "Angra dos Reis", "Nilópolis", "Resende", "Teresópolis", "Mesquita"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "Santa Cruz"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Santa Cruz do Sul", "Cachoeirinha", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba", "Cachoeira do Sul", "Lajeado"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Ouro Preto do Oeste", "Buritis"],
  RR: ["Boa Vista", "Caracaraí", "Rorainópolis", "Alto Alegre", "Mucajaí", "Cantá", "Bonfim", "Pacaraima", "Normandia", "Amajari"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí", "Criciúma", "Jaraguá do Sul", "Lages", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão", "São Bento do Sul", "Caçador", "Concórdia", "Camboriú", "Navegantes", "Indaial", "Gaspar"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José do Rio Preto", "Santos", "Mogi das Cruzes", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "São Vicente", "Franca", "Guarujá", "Taubaté", "Praia Grande", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "São Carlos", "Indaiatuba", "Araraquara", "Americana", "Presidente Prudente", "Rio Claro", "Marília", "Araçatuba", "Hortolândia"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Simão Dias", "Propriá", "Neópolis"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"],
};

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

// ─── Helpers ───────────────────────────────────────────────────────
function formatCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCEP(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

// ─── Base UI ───────────────────────────────────────────────────────
function Field({ label, error, hint, children }: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontFamily: font, fontWeight: 700, fontSize: "11px",
        letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted,
      }}>{label}</label>
      {children}
      {hint && !error && (
        <span style={{ fontFamily: font, fontSize: "12px", color: C.textMuted, fontWeight: 500 }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontFamily: font, fontSize: "12px", color: C.error, fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
}

const inputBase: CSSProperties = {
  fontFamily: font, fontWeight: 500, fontSize: "15px", color: C.white,
  background: C.grayLight, border: `1px solid ${C.grayBorder}`,
  borderRadius: "10px", padding: "13px 16px", outline: "none",
  width: "100%", boxSizing: "border-box", transition: "border-color 0.2s, background 0.2s",
};

function Input({ label, error, hint, suffix, ...props }: {
  label: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Field label={label} error={error} hint={hint}>
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          style={{
            ...inputBase,
            borderColor: error ? C.error : C.grayBorder,
            paddingRight: suffix ? "48px" : "16px",
            ...((props.style as CSSProperties) || {}),
          }}
          onFocus={e => { e.target.style.borderColor = C.purple; e.target.style.background = "rgba(124,34,213,0.08)"; }}
          onBlur={e => { e.target.style.borderColor = error ? C.error : C.grayBorder; e.target.style.background = C.grayLight; }}
        />
        {suffix && (
          <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            {suffix}
          </div>
        )}
      </div>
    </Field>
  );
}

function ReadonlyInput({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <Field label={label}>
      <div style={{
        ...inputBase,
        borderColor: value ? "rgba(76,175,130,0.4)" : C.grayBorder,
        background: "rgba(255,255,255,0.03)",
        color: value ? C.textSub : C.textMuted,
        display: "flex", alignItems: "center", gap: "8px",
        cursor: "default",
      }}>
        {loading ? (
          <div style={{ width: "14px", height: "14px", border: `2px solid rgba(124,34,213,0.3)`, borderTopColor: C.purple, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
        ) : value ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" fill="rgba(76,175,130,0.2)" stroke="#4caf82" strokeWidth="1.2"/>
            <path d="M4 7l2 2 4-4" stroke="#4caf82" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
        <span style={{ fontSize: "15px" }}>{value || "—"}</span>
      </div>
    </Field>
  );
}

// ─── Step Indicator ────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "40px" }}>
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: done ? C.purple : active ? C.purpleDim : "transparent",
                border: `2px solid ${done || active ? C.purple : "rgba(255,255,255,0.12)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s", flexShrink: 0,
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontFamily: font, fontWeight: 700, fontSize: "12px", color: active ? C.purple : "rgba(255,255,255,0.25)" }}>
                    {step.id}
                  </span>
                )}
              </div>
              <span style={{
                fontFamily: font, fontWeight: 700, fontSize: "10px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active ? C.white : done ? C.textSub : "rgba(255,255,255,0.2)",
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: "2px",
                background: done ? C.purple : "rgba(255,255,255,0.08)",
                margin: "0 8px", marginBottom: "22px",
                transition: "background 0.3s", borderRadius: "1px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontFamily: font, fontWeight: 900, fontSize: "26px", color: C.white, margin: 0, marginBottom: "6px", lineHeight: 1.2 }}>{title}</h2>
      <p style={{ fontFamily: font, fontWeight: 500, fontSize: "14px", color: C.textMuted, margin: 0 }}>{sub}</p>
    </div>
  );
}

// ─── Step 1: Personal ─────────────────────────────────────────────
function Step1({ data, onChange, errors, senha, confirmarSenha, onSenhaChange, onConfirmarSenhaChange }: {
  data: FormData;
  onChange: (key: string, value: string) => void;
  errors: Record<string, string | undefined>;
  senha: string;
  confirmarSenha: string;
  onSenhaChange: (value: string) => void;
  onConfirmarSenhaChange: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "fadeUp 0.3s ease" }}>
      <StepHeader title="Estamos felizes em atender você!" sub="Comece com suas informações básicas" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <Input label="Nome" value={data.first_name} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("first_name", e.target.value)} error={errors.first_name} placeholder="João" />
        <Input label="Sobrenome" value={data.last_name} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("last_name", e.target.value)} error={errors.last_name} placeholder="Silva" />
      </div>
      <Input label="E-mail" type="email" value={data.email} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value)} error={errors.email} placeholder="joao@email.com" />
      <Input label="Telefone" type="tel" value={data.phone_number} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("phone_number", e.target.value)} error={errors.phone_number} placeholder="+55 11 91234-5678" />
      <Input label="Data de Nascimento" type="date" value={data.date_of_birth} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("date_of_birth", e.target.value)} error={errors.date_of_birth} />
      {/* Campos de senha — validados localmente, não enviados à API */}
      <Input label="Senha" type="password" value={senha} onChange={(e: ChangeEvent<HTMLInputElement>) => onSenhaChange(e.target.value)} error={errors.senha} placeholder="Mínimo 6 caracteres" />
      <Input label="Confirmar Senha" type="password" value={confirmarSenha} onChange={(e: ChangeEvent<HTMLInputElement>) => onConfirmarSenhaChange(e.target.value)} error={errors.confirmarSenha} placeholder="Repita a senha" />
    </div>
  );
}

// ─── Step 2: Document (CPF only) ──────────────────────────────────
function Step2({ data, onChange, errors }: {
  data: FormData;
  onChange: (key: string, value: string) => void;
  errors: Record<string, string | undefined>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "fadeUp 0.3s ease" }}>
      <StepHeader title="Documento" sub="Informe seu CPF para verificação de identidade" />

      <Field label="Tipo de Documento">
        <div style={{
          ...inputBase,
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
          color: C.textSub,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "default",
        }}>
          <span>CPF — Cadastro de Pessoas Físicas</span>
          <div style={{
            background: C.purpleDim, border: `1px solid ${C.purpleBorder}`,
            borderRadius: "6px", padding: "3px 8px",
            fontFamily: font, fontWeight: 700, fontSize: "10px",
            color: C.purple, letterSpacing: "0.06em",
          }}>BR</div>
        </div>
      </Field>

      <Input
        label="CPF"
        value={data.doc_value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("doc_value", formatCPF(e.target.value))}
        error={errors.doc_value}
        placeholder="000.000.000-00"
        inputMode="numeric"
        maxLength={14}
      />

      <Field label="País Emissor">
        <div style={{
          ...inputBase,
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
          color: C.textSub,
          display: "flex", alignItems: "center", gap: "10px",
          cursor: "default",
        }}>
          <span style={{ fontSize: "18px" }}>🇧🇷</span>
          <span>Brasil</span>
        </div>
      </Field>

      <div style={{
        display: "flex", gap: "10px",
        background: C.purpleDim, border: `1px solid ${C.purpleBorder}`,
        borderRadius: "10px", padding: "13px 16px",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="8" cy="8" r="6.5" stroke={C.purple} strokeWidth="1.5"/>
          <path d="M8 5v4M8 10.5v.5" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p style={{ fontFamily: font, fontWeight: 500, fontSize: "12px", color: C.textSub, margin: 0, lineHeight: "1.6" }}>
          Seu CPF é criptografado e processado com segurança pela infraestrutura da UnboundCash.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Address (CEP API) ────────────────────────────────────
function Step3({ data, onChange, errors }: {
  data: FormData;
  onChange: (key: string, value: string) => void;
  errors: Record<string, string | undefined>;
}) {
  const [cepLoading, setCepLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const handleStateChange = (uf: string) => {
    onChange("state", uf);
    onChange("city", "");
  };

  const lookupCEP = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    onChange("street_line_1", "");
    onChange("city", "");
    onChange("state", "");
    onChange("neighborhood", "");
    setManualMode(false);

    try {
      let street = "", city = "", state = "", neighborhood = "";
      let found = false;

      try {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${digits}`);
        if (res.ok) {
          const json = await res.json();
          street = json.street || ""; city = json.city || "";
          state = json.state || ""; neighborhood = json.neighborhood || "";
          found = true;
        }
      } catch {}

      if (!found) {
        try {
          const res2 = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
          if (res2.ok) {
            const json2 = await res2.json();
            if (!json2.erro) {
              street = json2.logradouro || ""; city = json2.localidade || "";
              state = json2.uf || ""; neighborhood = json2.bairro || "";
              found = true;
            }
          }
        } catch {}
      }

      if (!found) {
        setManualMode(true);
      } else {
        onChange("street_line_1", street);
        onChange("city", city);
        onChange("state", state);
        onChange("neighborhood", neighborhood);
      }
    } catch {
      setManualMode(true);
    } finally {
      setCepLoading(false);
    }
  };

  const handleCEPChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange("postal_code", formatted);
    setManualMode(false);
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) lookupCEP(digits);
  };

  const addressFound = !manualMode && data.city && data.state;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "fadeUp 0.3s ease" }}>
      <StepHeader title="Endereço" sub="Insira seu CEP" />

      <Input
        label="CEP"
        value={data.postal_code}
        onChange={handleCEPChange}
        placeholder="00000-000"
        error={errors.postal_code}
        inputMode="numeric"
        maxLength={9}
        suffix={cepLoading ? (
          <div style={{ width: "16px", height: "16px", border: `2px solid rgba(124,34,213,0.3)`, borderTopColor: C.purple, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        ) : addressFound ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="rgba(76,175,130,0.15)" stroke="#4caf82" strokeWidth="1.2"/>
            <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#4caf82" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
      />

      {manualMode && (
        <div style={{
          display: "flex", gap: "10px", alignItems: "flex-start",
          background: "rgba(240,96,96,0.08)", border: "1px solid rgba(240,96,96,0.25)",
          borderRadius: "10px", padding: "12px 14px", animation: "fadeUp 0.3s ease",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="8" cy="8" r="6.5" stroke="#f06060" strokeWidth="1.4"/>
            <path d="M8 5v3.5M8 10.5v.5" stroke="#f06060" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <p style={{ fontFamily: font, fontWeight: 500, fontSize: "12px", color: "rgba(240,150,150,0.9)", margin: 0, lineHeight: "1.6" }}>
            CEP não encontrado automaticamente. Preencha o endereço abaixo.
          </p>
        </div>
      )}

      {!manualMode && (
        <div style={{
          display: "flex", flexDirection: "column", gap: "14px",
          opacity: addressFound || cepLoading ? 1 : 0.3,
          transition: "opacity 0.3s",
          pointerEvents: addressFound ? "auto" : "none",
        }}>
          <ReadonlyInput label="Logradouro" value={data.street_line_1} loading={cepLoading} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <ReadonlyInput label="Cidade" value={data.city} loading={cepLoading} />
            <ReadonlyInput label="Estado" value={data.state} loading={cepLoading} />
          </div>
          <ReadonlyInput label="Bairro" value={data.neighborhood} loading={cepLoading} />
        </div>
      )}

      {manualMode && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.35s ease" }}>
          <Input
            label="Logradouro"
            value={data.street_line_1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("street_line_1", e.target.value)}
            error={errors.street_line_1}
            placeholder="Rua das Flores"
          />
          <Input
            label="Bairro"
            value={data.neighborhood}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("neighborhood", e.target.value)}
            placeholder="Bairro"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Field label="Estado" error={errors.state}>
              <select
                value={data.state}
                onChange={e => handleStateChange(e.target.value)}
                style={{ ...inputBase, background: "#0a1a14", borderColor: errors.state ? C.error : C.grayBorder, cursor: "pointer" }}
                onFocus={e => { e.target.style.borderColor = C.purple; e.target.style.background = "rgba(124,34,213,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = errors.state ? C.error : C.grayBorder; e.target.style.background = "#0a1a14"; }}
              >
                <option value="">UF</option>
                {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </Field>

            <Field label="Cidade" error={errors.city}>
              <select
                value={data.city}
                onChange={e => onChange("city", e.target.value)}
                disabled={!data.state}
                style={{
                  ...inputBase,
                  background: "#0a1a14",
                  borderColor: errors.city ? C.error : C.grayBorder,
                  cursor: !data.state ? "not-allowed" : "pointer",
                  opacity: !data.state ? 0.4 : 1,
                }}
                onFocus={e => { e.target.style.borderColor = C.purple; }}
                onBlur={e => { e.target.style.borderColor = errors.city ? C.error : C.grayBorder; }}
              >
                <option value="">
                  {!data.state ? "Selecione o estado primeiro" : "Selecione a cidade"}
                </option>
                {(CITIES_BY_UF[data.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>
      )}

      {(addressFound || manualMode) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", animation: "fadeUp 0.3s ease" }}>
          <Input
            label="Número"
            value={data.street_number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("street_number", e.target.value)}
            error={errors.street_number}
            placeholder="123"
            inputMode="numeric"
          />
          <Input
            label="Complemento (opcional)"
            value={data.street_line_2}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("street_line_2", e.target.value)}
            placeholder="Apto 4B"
          />
        </div>
      )}

      <Field label="País">
        <div style={{
          ...inputBase, background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)", color: C.textSub,
          display: "flex", alignItems: "center", gap: "10px", cursor: "default",
        }}>
          <span style={{ fontSize: "18px" }}>🇧🇷</span>
          <span>Brasil</span>
        </div>
      </Field>
    </div>
  );
}

// ─── Step 4: Review ────────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      gap: "16px", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontFamily: font, fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: C.textMuted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: font, fontWeight: 500, fontSize: "14px", color: C.white, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const streetFull = [data.street_line_1, data.street_number, data.street_line_2].filter(Boolean).join(", ");

  const fmtCPF = (v: string) => {
    const d = (v || "").replace(/\D/g, "").slice(0, 11);
    return d.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const fmtCEP = (v: string) => {
    const d = (v || "").replace(/\D/g, "").slice(0, 8);
    return d.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const fmtDate = (v: string) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    return `${d}/${m}/${y}`;
  };

  const fmtPhone = (v: string) => {
    const d = (v || "").replace(/\D/g, "");
    if (d.length === 13) return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    return v;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", animation: "fadeUp 0.3s ease" }}>
      <StepHeader title="Revise seus dados" sub="Confirme tudo antes de enviar" />
      <div style={{ background: C.grayLight, border: `1px solid ${C.grayBorder}`, borderRadius: "12px", padding: "4px 16px 12px" }}>
        {[
          { section: "Pessoal", rows: [
            { label: "Nome", value: `${data.first_name} ${data.last_name}` },
            { label: "E-mail", value: data.email },
            { label: "Telefone", value: fmtPhone(data.phone_number) },
            { label: "Nascimento", value: fmtDate(data.date_of_birth) },
          ]},
          { section: "Documento", rows: [
            { label: "Tipo", value: "CPF" },
            { label: "Número", value: fmtCPF(data.doc_value) },
            { label: "País Emissor", value: "🇧🇷 Brasil" },
          ]},
          { section: "Endereço", rows: [
            { label: "CEP", value: fmtCEP(data.postal_code) },
            { label: "Logradouro", value: streetFull },
            { label: "Bairro", value: data.neighborhood },
            { label: "Cidade / Estado", value: `${data.city}, ${data.state}` },
            { label: "País", value: "🇧🇷 Brasil" },
          ]},
        ].map(({ section, rows }) => (
          <div key={section}>
            <div style={{ fontFamily: font, fontWeight: 900, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.purple, marginTop: "20px", marginBottom: "2px" }}>
              {section}
            </div>
            {rows.map(r => <ReviewRow key={r.label} label={r.label} value={r.value} />)}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: font, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.2)", lineHeight: "1.6", marginTop: "14px", textAlign: "center" }}>
        Ao enviar, você autoriza a UnboundCash a verificar sua identidade conforme as regulamentações aplicáveis.
      </p>
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  doc_value: string;
  postal_code: string;
  street_line_1: string;
  street_number: string;
  street_line_2: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

// ─── Main ──────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Estado do feedback de sucesso ou erro
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Campos de senha (não enviados à API, apenas validados localmente)
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [formData, setFormData] = useState<FormData>({
    first_name: "", last_name: "", email: "", phone_number: "", date_of_birth: "",
    doc_value: "",
    postal_code: "", street_line_1: "", street_number: "", street_line_2: "",
    neighborhood: "", city: "", state: "", country: "BRA",
  });

  const update = (key: string, value: string) => {
    setFormData(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!formData.first_name.trim()) e.first_name = "Campo obrigatório";
      if (!formData.last_name.trim()) e.last_name = "Campo obrigatório";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Insira um e-mail válido";
      if (!formData.phone_number.trim()) e.phone_number = "Campo obrigatório";
      if (!formData.date_of_birth) e.date_of_birth = "Campo obrigatório";
      // Validação de senha
      if (!senha || senha.length < 6) e.senha = "Senha deve ter pelo menos 6 caracteres";
      if (senha !== confirmarSenha) e.confirmarSenha = "As senhas não coincidem";
    }
    if (step === 2) {
      const cpfDigits = formData.doc_value.replace(/\D/g, "");
      if (cpfDigits.length !== 11) e.doc_value = "Insira um CPF válido com 11 dígitos";
    }
    if (step === 3) {
      const cepDigits = formData.postal_code.replace(/\D/g, "");
      if (cepDigits.length !== 8) e.postal_code = "Insira um CEP válido";
      if (!formData.state) e.state = "Campo obrigatório";
      if (!formData.city) e.city = "Campo obrigatório";
      if (!formData.street_number.trim()) e.street_number = "Campo obrigatório";
      if (!formData.street_line_1.trim()) e.street_line_1 = "Campo obrigatório";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => { setStep(s => s - 1); setErrors({}); };

  const submit = async () => {
    // Validação final das senhas antes de chamar a API
    if (senha !== confirmarSenha) {
      setFeedback({ type: "error", message: "As senhas não coincidem." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const streetFull = [formData.street_line_1, formData.street_number].filter(Boolean).join(", ");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "individual",
          first_name:    formData.first_name,
          last_name:     formData.last_name,
          email:         formData.email,
          phone_number:  formData.phone_number,
          date_of_birth: formData.date_of_birth,
          // Documento no formato esperado pela UnblockPay
          identity_documents: [{ type: "tax_id", value: formData.doc_value.replace(/\D/g, ""), country: "BRA" }],
          // Endereço aninhado conforme exigido pela API
          address: {
            street_line_1: streetFull,
            street_line_2: formData.street_line_2 || undefined,
            city:          formData.city,
            state:         formData.state,
            postal_code:   formData.postal_code.replace(/\D/g, ""),
            country:       "BRA",
          },
        }),
      });

      const data = await res.json();

      // 207 (Multi-Status) indica cliente criado mas wallet falhou — tratado como sucesso parcial
      if (!res.ok && res.status !== 207) {
        throw new Error(data.mensagem || data.error || "Erro ao criar conta");
      }

      // Exibe feedback de sucesso e redireciona para /login após 2 segundos
      setFeedback({ type: "success", message: "Conta criada com sucesso! Redirecionando para o login..." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setFeedback({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.18); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(3) hue-rotate(240deg); cursor: pointer; }
        select option { background: #0a1a14; color: #fff; }
      `}</style>

      <div style={{
        minHeight: "calc(100vh - 64px)",
        background: "#000904",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Purple glow */}
        <div style={{
          position: "fixed", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px",
          background: "radial-gradient(ellipse, rgba(124,34,213,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "500px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "36px",
          animation: "fadeUp 0.45s ease 0.1s both",
        }}>
          <>
              <StepIndicator current={step} />
              {step === 1 && (
                <Step1
                  data={formData}
                  onChange={update}
                  errors={errors}
                  senha={senha}
                  confirmarSenha={confirmarSenha}
                  onSenhaChange={setSenha}
                  onConfirmarSenhaChange={setConfirmarSenha}
                />
              )}
              {step === 2 && <Step2 data={formData} onChange={update} errors={errors} />}
              {step === 3 && <Step3 data={formData} onChange={update} errors={errors} />}
              {step === 4 && <Step4 data={formData} />}

              {/* Banner de feedback (sucesso ou erro) exibido acima dos botões */}
              {feedback && (
                <div style={{ marginTop: "20px" }}>
                  <Feedback
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {step > 1 && (
                  <button
                    onClick={back}
                    style={{
                      padding: "13px 20px", background: "transparent",
                      border: `1px solid ${C.grayBorder}`, borderRadius: "10px",
                      color: C.textSub, fontFamily: font, fontWeight: 700, fontSize: "13px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.target as HTMLButtonElement).style.color = C.white; }}
                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = C.grayBorder; (e.target as HTMLButtonElement).style.color = C.textSub; }}
                  >
                    Voltar
                  </button>
                )}
                {/* No step 4, usa LoadingButton com os labels pedidos; nos outros steps, botão padrão */}
                {step === 4 ? (
                  <div style={{ flex: 1 }}>
                    <LoadingButton
                      label="Criar conta"
                      loadingLabel="Criando conta..."
                      isLoading={loading}
                      onClick={submit}
                      fullWidth
                    />
                  </div>
                ) : (
                  <button
                    onClick={next}
                    style={{
                      flex: 1, padding: "14px",
                      background: C.purple,
                      border: "none", borderRadius: "10px", color: C.white,
                      fontFamily: font, fontWeight: 900, fontSize: "14px", letterSpacing: "0.02em",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = C.purpleLight; }}
                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = C.purple; }}
                  >
                    Continuar →
                  </button>
                )}
              </div>

              <p style={{ textAlign: "center", marginTop: "18px", fontFamily: font, fontWeight: 700, fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
                ETAPA {step} DE 4
              </p>
          </>
        </div>

        <p style={{
          marginTop: "24px", fontFamily: font, fontWeight: 700, fontSize: "10px",
          color: "rgba(255,255,255,0.15)", letterSpacing: "0.12em", textTransform: "uppercase",
          animation: "fadeUp 0.5s ease 0.2s both",
        }}>
          Protegido por UnboundCash
        </p>
      </div>
    </>
  );
}
