This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuração de Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env.local
```

Consulte os comentários dentro de `.env.example` para instruções sobre cada variável.

## Configuração do Webhook da UnblockPay

O endpoint `/api/webhooks/unblockpay` recebe notificações automáticas da UnblockPay sobre
mudanças de status de transações. Siga os passos abaixo para configurá-lo corretamente.

### 1. Gerar o segredo do webhook

Execute o comando abaixo para gerar um segredo aleatório seguro:

```bash
# Opção 1 — usando openssl (recomendado)
openssl rand -hex 32

# Opção 2 — usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Adicionar o segredo ao ambiente local

Copie o valor gerado e adicione ao seu `.env.local`:

```env
UNBLOCKPAY_WEBHOOK_SECRET=cole_o_valor_gerado_aqui
```

### 3. Adicionar o segredo na Vercel

No painel da Vercel, acesse **Settings > Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `UNBLOCKPAY_WEBHOOK_SECRET` | *(valor gerado no passo 1)* |
| `NEXT_PUBLIC_APP_URL` | `https://luzdiaria.com/` |

### 4. Registrar o webhook no painel da UnblockPay

Ao criar o webhook no painel da UnblockPay, utilize as seguintes configurações:

- **URL do endpoint:**
  ```
  [NEXT_PUBLIC_APP_URL]/api/webhooks/unblockpay
  ```
  Exemplo de produção: `https://luzdiaria.com/api/webhooks/unblockpay`

- **Eventos para assinar:**
  - `transaction.completed` — dispara quando um pay-in ou payout é concluído com sucesso
  - `transaction.failed` — dispara quando uma transação falha
  - `transaction.refunded` — dispara quando uma transação é reembolsada

- **Segredo compartilhado:** configure o mesmo valor de `UNBLOCKPAY_WEBHOOK_SECRET` no painel
  da UnblockPay. Ele é enviado no header `x-webhook-secret` de cada requisição e verificado
  pelo endpoint antes de processar qualquer evento.

### Como funciona a validação

O endpoint lê o header `x-webhook-secret` de cada requisição recebida e compara com
`process.env.UNBLOCKPAY_WEBHOOK_SECRET`. Requisições sem o header ou com valor incorreto
recebem resposta `401 Unauthorized` e são descartadas.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
