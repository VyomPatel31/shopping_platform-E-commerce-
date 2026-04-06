import fetch from 'node-fetch'
import ejs from 'ejs'
import path from 'path'

// Configure Brevo (Sendinblue) API details
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (BREVO_API_KEY) {
  console.log('✅ Brevo Email Service Configured');
} else {
  console.warn('⚠️ Warning: BREVO_API_KEY is missing. Emails will not be sent.');
}

const sendMail = async (email: string, template: string, data: any, subject?: string) => {
  try {
    const templatePath = path.join(process.cwd(), 'views', template)
    const html = await ejs.renderFile(templatePath, data) as string

    if (!BREVO_API_KEY) {
      console.warn('❌ Cannot send email: BREVO_API_KEY is not configured.');
      return;
    }

    console.log(`📨 Sending ${subject || 'Notification'} email via Brevo API to: ${email}`)

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
          email: process.env.MAIL_FROM || 'noreply@yourdomain.com'
        },
        to: [{ email: email, name: email }],
        subject: subject || 'Notification',
        htmlContent: html
      })
    });

    const result = await response.json() as any;

    if (!response.ok) {
       throw new Error(`Brevo API Error (${response.status}): ${JSON.stringify(result)}`);
    }

    console.log('📧 Email sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('🚨 Email sending failed:', error.message)
    throw error;
  }
}

export default sendMail
