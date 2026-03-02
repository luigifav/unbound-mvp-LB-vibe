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

Copie o arquivo `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

### Configuração do Webhook da UnblockPay

O endpoint `/api/webhooks/unblockpay` recebe notificações automáticas da UnblockPay sobre mudanças
de status das transações. Para que funcione corretamente, siga os passos abaixo.

#### 1. Gerar o segredo do webhook

Execute o comando abaixo para gerar um valor aleatório seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2. Adicionar o segredo ao ambiente local

Abra o `.env.local` e adicione o valor gerado:

```env
UNBLOCKPAY_WEBHOOK_SECRET=<valor-gerado-acima>
```

#### 3. Adicionar o segredo nas variáveis de ambiente da Vercel

No painel da Vercel, acesse **Settings > Environment Variables** e adicione:

| Variável | Valor |
|---|---|
| `UNBLOCKPAY_WEBHOOK_SECRET` | `<valor-gerado-acima>` |
| `NEXT_PUBLIC_APP_URL` | `https://luzdiaria.com/` |

#### 4. Registrar o webhook no painel da UnblockPay

No painel da UnblockPay, cadastre um novo webhook com as seguintes configurações:

- **URL do webhook:** `[NEXT_PUBLIC_APP_URL]/api/webhooks/unblockpay`
  - Exemplo: `https://luzdiaria.com/api/webhooks/unblockpay`
- **Eventos para assinar:**
  - `transaction.completed`
  - `transaction.failed`
  - `transaction.refunded`
- **Segredo compartilhado:** o mesmo valor definido em `UNBLOCKPAY_WEBHOOK_SECRET`

> **Importante:** o segredo configurado no painel da UnblockPay deve ser **exatamente igual**
> ao valor em `UNBLOCKPAY_WEBHOOK_SECRET`. Ele é enviado no header `x-webhook-secret` de cada
> requisição e validado pelo servidor antes de processar qualquer evento.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
