import nodemailer from 'nodemailer'
import { env } from '@/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

type SendVerificationEmail = {
  to: string,
  token: string,
}

export async function sendVerificationEmail({ to, token }: SendVerificationEmail) {
  const verificationUrl = `http://localhost:${env.PORT}/api/auth/verify-email?token=${token}`

  await transporter.sendMail({
    from: `"Volleyball Schedule" <${env.SMTP_USER}>`,
    to,
    subject: 'Verifique seu email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Verificação de Email</h1>
        <p>Olá! Obrigado por se cadastrar no Volleyball Schedule.</p>
        <p>Clique no botão abaixo para verificar seu email:</p>
        <a href="${verificationUrl}"
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verificar Email
        </a>
        <p style="color: #6b7280; font-size: 14px;">Este link expira em 24 horas.</p>
        <p style="color: #6b7280; font-size: 12px;">Se você não criou uma conta, ignore este email.</p>
      </div>
    `,
  })
}