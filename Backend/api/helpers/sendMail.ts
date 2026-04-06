import nodemailer from 'nodemailer'
import fetch from 'node-fetch'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure Brevo (Sendinblue) API details
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_PORT === '465', // True for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000 // 10 seconds
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
  const templatePath = path.join(process.cwd(), 'views', template)
  const html = await ejs.renderFile(templatePath, data) as string

  // Try Brevo first if API key is available
  if (BREVO_API_KEY) {
    try {
      console.log(`📨 Attempting to send ${subject || 'Notification'} email via Brevo API (HTTPS) to: ${email}`)

      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Shopping Platform',
            email: process.env.MAIL_FROM || process.env.MAIL_USER || 'noreply@yourdomain.com'
          },
          to: [{ email: email, name: email }],
          subject: subject || 'Notification',
          htmlContent: html
        })
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(`Brevo API Error (${response.status}): ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('📧 Email sent successfully via Brevo API:', result);
      return result;
    } catch (brevoError: any) {
      console.error('🚨 Brevo Error:', brevoError.message)
      console.log('⚠️ Falling back to alternative SMTP...')
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
