import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

console.log('--- MAIL CONFIGURATION ---')
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

const sendMail = async (email: string, template: string, data: any, subject?: string) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('⚠️ Warning: Email credentials missing in environment variables.');
    return;
  }

  const templatePath = path.join(__dirname, '../../views', template)
  const html = await ejs.renderFile(templatePath, data) as string

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: email,
    subject: subject || 'Notification',
    html,
  }

  try {
    console.log(`📨 Attempting to send ${subject || 'Notification'} email to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('🚨 SMTP Error sending email:', error)
    throw error
  }
}

export default sendMail
