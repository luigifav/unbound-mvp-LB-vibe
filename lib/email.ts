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

const DEFAULT_WHATSAPP_LINK =
  'https://wa.me/5511936186784?text=Ol%C3%A1%2C%20meu%20KYC%20foi%20conclu%C3%ADdo%2C%20quero%20saber%20mais%20sobre%20como%20transacionar%20agora!'

/**
 * Envia o e-mail de conta aprovada após o KYC ser validado com sucesso.
 * Inclui um CTA para o cliente entrar em contato via WhatsApp e iniciar transações.
 *
 * @param params.to   Email do destinatário
 * @param params.name Nome do usuário (para personalizar a saudação)
 */
export async function sendKycApprovedEmail(params: {
  to: string
  name: string
}): Promise<void> {
  const resend = getResend()
  const from = process.env.RESEND_FROM_EMAIL ?? 'Unbound <onboarding@resend.dev>'
  const whatsappLink = process.env.WHATSAPP_LINK ?? DEFAULT_WHATSAPP_LINK

  await resend.emails.send({
    from,
    to: params.to,
    subject: 'Sua conta está pronta para transacionar — Unbound',
    html: buildKycApprovedEmailHtml(params.name, whatsappLink),
  })
}

function buildKycApprovedEmailHtml(name: string, whatsappLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;padding:40px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
            <tr><td>
              <h1 style="margin:0 0 8px;font-size:22px;color:#111">Parabéns, ${name}! 🎉</h1>
              <p style="margin:0 0 16px;color:#444;line-height:1.6">
                Sua identidade foi verificada com sucesso e sua conta na <strong>Unbound</strong> está 100% ativa.
              </p>
              <p style="margin:0 0 32px;color:#444;line-height:1.6">
                Agora você já pode transacionar. Se quiser começar, é só chamar a gente pelo WhatsApp — vamos te guiar em cada passo.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#25D366">
                    <a href="${whatsappLink}"
                       style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:.3px">
                      Falar no WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
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
