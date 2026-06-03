import nodemailer from 'nodemailer'
import { env } from './env'

export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
})

export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `${env.clientUrl}/verify-email?token=${token}`
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: 'DevPrep AI — Email tasdiqlash',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0e1a;color:#e2e8f0;padding:40px;border-radius:12px">
        <h1 style="color:#00d4ff;font-size:28px;margin-bottom:8px">DevPrep AI</h1>
        <p style="color:#94a3b8;margin-bottom:32px">Interview preparation platform</p>
        <h2 style="font-size:20px;margin-bottom:16px">Email manzilingizni tasdiqlang</h2>
        <p style="color:#94a3b8;line-height:1.6;margin-bottom:32px">
          DevPrep AI ga xush kelibsiz! Hisobingizni faollashtirish uchun quyidagi tugmani bosing.
        </p>
        <a href="${url}" style="background:#00d4ff;color:#0a0e1a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-bottom:32px">
          Email tasdiqlash
        </a>
        <p style="color:#64748b;font-size:13px">
          Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.<br>
          Havola 24 soat davomida amal qiladi.
        </p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const url = `${env.clientUrl}/reset-password?token=${token}`
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: 'DevPrep AI — Parolni tiklash',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0e1a;color:#e2e8f0;padding:40px;border-radius:12px">
        <h1 style="color:#00d4ff;font-size:28px;margin-bottom:8px">DevPrep AI</h1>
        <p style="color:#94a3b8;margin-bottom:32px">Interview preparation platform</p>
        <h2 style="font-size:20px;margin-bottom:16px">Parolni tiklash</h2>
        <p style="color:#94a3b8;line-height:1.6;margin-bottom:32px">
          Parolingizni tiklash uchun quyidagi tugmani bosing. Havola 1 soat davomida amal qiladi.
        </p>
        <a href="${url}" style="background:#ef4444;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-bottom:32px">
          Parolni tiklash
        </a>
        <p style="color:#64748b;font-size:13px">
          Agar siz bu so'rovni yubormagan bo'lsangiz, hisobingiz xavfsiz. Ushbu xatni e'tiborsiz qoldiring.
        </p>
      </div>
    `,
  })
}
