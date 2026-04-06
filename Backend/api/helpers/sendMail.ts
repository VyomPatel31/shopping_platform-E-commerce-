import nodemailer from 'nodemailer'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure Brevo (Sendinblue)
let brevoApiInstance: any = null
if (process.env.BREVO_API_KEY) {
  const defaultClient = SibApiV3Sdk.ApiClient.instance
  const apiKey = defaultClient.authentications['api-key']
  apiKey.apiKey = process.env.BREVO_API_KEY
  brevoApiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '465'),
  secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports
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
console.log(`Brevo API Key: ${process.env.BREVO_API_KEY ? 'Configured' : 'Not configured'}`)
console.log('---------------------------')

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', {
      message: error.message,
      code: (error as any).code,
      command: (error as any).command,
      stack: error.stack
    });
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

const sendMail = async (email: string, template: string, data: any, subject?: string) => {
  const templatePath = path.join(__dirname, '../../views', template)
  const html = await ejs.renderFile(templatePath, data) as string

  // Try Brevo first if API key is available
  if (brevoApiInstance && process.env.BREVO_API_KEY) {
    try {
      console.log(`📨 Attempting to send ${subject || 'Notification'} email via Brevo to: ${email}`)

      const sendSmtpEmail = {
        subject: subject || 'Notification',
        htmlContent: html,
        sender: {
          name: 'Shopping Platform',
          email: process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@yourdomain.com'
        },
        to: [{ email: email }]
      }

      const result = await brevoApiInstance.sendTransacEmail(sendSmtpEmail)
      console.log('📧 Email sent successfully via Brevo:', result.response.statusCode)
      return result
    } catch (brevoError) {
      console.error('🚨 Brevo Error:', brevoError)
      console.log('⚠️ Falling back to Gmail SMTP...')
    }
  }

  // Fallback to Gmail SMTP
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('⚠️ Warning: Email credentials missing in environment variables.');
    return;
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: email,
    subject: subject || 'Notification',
    html,
  }

  try {
    console.log(`📨 Attempting to send ${subject || 'Notification'} email via Gmail SMTP to: ${email}`)
    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully via Gmail SMTP:', info.messageId)
    return info
  } catch (error) {
    console.error('🚨 SMTP Error sending email:', error)
    throw error
  }
}

export default sendMail
