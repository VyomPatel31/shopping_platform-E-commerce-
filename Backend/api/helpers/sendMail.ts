import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isGmail = process.env.MAIL_HOST?.includes('gmail');

const transporter = nodemailer.createTransport({
  service: isGmail ? 'gmail' : undefined,
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: isGmail ? 465 : (Number(process.env.MAIL_PORT) || 587),
  secure: isGmail ? true : (process.env.MAIL_PORT === '465'),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

console.log('--- MAIL CONFIGURATION ---')
console.log(`Mail Host: ${process.env.MAIL_HOST}`)
console.log(`Mail User: ${process.env.MAIL_USER}`)
console.log(`Mail From: ${process.env.MAIL_FROM}`)
console.log('---------------------------')

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

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
