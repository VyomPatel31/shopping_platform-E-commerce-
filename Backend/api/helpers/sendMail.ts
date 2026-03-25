import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_HOST?.includes('gmail') ? 'gmail' : undefined,
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Should be an App Password for Gmail
  },
  tls: {
    rejectUnauthorized: false
  }
})

const sendMail = async (email: string, template: string, data: any) => {
  const templatePath = path.join(__dirname, '../../views', template)
  const html = await ejs.renderFile(templatePath, data) as string

  const mailOptions = {
    from: process.env.MAIL_FROM!,
    to: email,
    subject: 'Verification OTP',
    html,
  }

  return await transporter.sendMail(mailOptions)
}

export default sendMail
