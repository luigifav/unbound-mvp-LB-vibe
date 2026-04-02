// Utilitário de envio de emails via Resend

import { Resend } from 'resend'

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error(
      'Variável de ambiente RESEND_API_KEY não configurada. ' +
      'Adicione-a no painel do Vercel ou no arquivo .env.local.',
    )
  }
  return new Resend(apiKey)
}

/**
 * Envia o email de boas-vindas com o link de verificação KYC.
 *
 * @param params.to               Email do destinatário
 * @param params.name             Nome do usuário (para personalizar a saudação)
 * @param params.verificationLink Link de verificação KYC gerado pela UnblockPay
 */
export async function sendKycEmail(params: {
  to: string
  name: string
  verificationLink: string
}): Promise<void> {
  const resend = getResend()
  const from = process.env.RESEND_FROM_EMAIL ?? 'Unbound <onboarding@resend.dev>'

  await resend.emails.send({
    from,
    to: params.to,
    subject: 'Complete sua verificação de identidade — Unbound',
    html: buildKycEmailHtml(params.name, params.verificationLink),
  })
}

function buildKycEmailHtml(name: string, link: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;padding:40px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
            <tr><td>
              <h1 style="margin:0 0 8px;font-size:22px;color:#111">Olá, ${name}!</h1>
              <p style="margin:0 0 16px;color:#444;line-height:1.6">
                Sua conta na <strong>Unbound</strong> foi criada com sucesso.
              </p>
              <p style="margin:0 0 32px;color:#444;line-height:1.6">
                Para começar a transacionar, você precisa completar a verificação de identidade (KYC).
                O processo leva poucos minutos.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#000">
                    <a href="${link}"
                       style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:.3px">
                      Verificar identidade
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;color:#888;font-size:12px;line-height:1.6">
                Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                <a href="${link}" style="color:#555;word-break:break-all">${link}</a>
              </p>
              <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
              <p style="margin:0;color:#aaa;font-size:12px">
                Este email foi enviado pela Unbound. Se você não criou uma conta, ignore esta mensagem.
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}
