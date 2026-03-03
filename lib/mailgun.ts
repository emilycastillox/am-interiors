import formData from 'form-data'
import Mailgun from 'mailgun.js'

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_BASE_URL = process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net'
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || (MAILGUN_DOMAIN ? `noreply@${MAILGUN_DOMAIN}` : '')
const MAILGUN_FROM_NAME = process.env.MAILGUN_FROM_NAME || 'AM Interiors'

let mailgunClient: any = null

/**
 * Get or initialize Mailgun client
 */
function getMailgunClient(): any {
  if (!MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY environment variable is not set')
  }
  if (!MAILGUN_DOMAIN || !MAILGUN_DOMAIN.trim()) {
    throw new Error(
      'MAILGUN_DOMAIN is required. Set it in .env to your domain from Mailgun (Sending → Domains). Sandbox domain looks like sandboxXXXXXXXX.mailgun.org.'
    )
  }

  if (!mailgunClient) {
    const mailgun = new Mailgun(formData)
    
    // Clean the API key - remove 'api:' prefix if present, and any whitespace
    let cleanApiKey = MAILGUN_API_KEY.trim()
    if (cleanApiKey.startsWith('api:')) {
      cleanApiKey = cleanApiKey.replace(/^api:/, '').trim()
    }
    
    // Try simpler initialization - only add url if it's not the default
    const clientConfig: any = {
      username: 'api',
      key: cleanApiKey,
    }
    
    // Only add URL if it's different from default (for EU accounts)
    if (MAILGUN_BASE_URL !== 'https://api.mailgun.net') {
      clientConfig.url = MAILGUN_BASE_URL
    }
    
    mailgunClient = mailgun.client(clientConfig)
  }

  return mailgunClient
}

export interface SendInvoiceEmailOptions {
  to: string
  subject: string
  pdfBuffer: ArrayBuffer | Buffer
  pdfFilename?: string
  text?: string
  html?: string
}

/**
 * Send a test email via Mailgun (following Mailgun.js documentation structure)
 * @param to - Recipient email address (can include name like "NAME <email@example.com>")
 * @param subject - Email subject
 * @param text - Plain text email body
 * @param html - HTML email body (optional)
 * @returns Mailgun message response
 */
export async function sendTestEmail(
  to: string,
  subject?: string,
  text?: string,
  html?: string
): Promise<any> {
  const client = getMailgunClient()
  
  // Use postmaster format for sandbox domain
  const fromEmail = MAILGUN_DOMAIN.includes('sandbox') 
    ? `Mailgun Sandbox <postmaster@${MAILGUN_DOMAIN}>`
    : `${MAILGUN_FROM_NAME} <${MAILGUN_FROM_EMAIL}>`

  // Extract name from "NAME <email>" format or use email as-is
  const recipientName = to.includes('<') ? to.split('<')[0].trim() : null
  const recipientEmail = to.includes('<') ? to.match(/<(.+)>/)?.[1] || to : to
  
  const messageData: any = {
    from: fromEmail,
    to: [to], // Keep original format if name included
    subject: subject || (recipientName ? `Hello ${recipientName}` : 'Hello'),
    text: text || (recipientName 
      ? `Congratulations ${recipientName}, you just sent an email with Mailgun! You are truly awesome!`
      : 'Congratulations, you just sent an email with Mailgun! You are truly awesome!'),
  }

  if (html) {
    messageData.html = html
  }

  try {
    const response = await client.messages.create(MAILGUN_DOMAIN!, messageData)
    return response
  } catch (error: any) {
    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown error'
    const errorDetails = error.response?.body || error.response?.data || error.body || ''
    throw new Error(`Failed to send test email: ${errorMessage}${errorDetails ? ` - ${JSON.stringify(errorDetails)}` : ''}`)
  }
}

/**
 * Send an invoice email with PDF attachment via Mailgun
 * @param options - Email options including recipient, subject, and PDF buffer
 * @returns Mailgun message response
 */
export async function sendInvoiceEmail(options: SendInvoiceEmailOptions): Promise<any> {
  const { to, subject, pdfBuffer, pdfFilename = 'invoice.pdf', text, html } = options

  const client = getMailgunClient()

  const messageData = {
    from: `${MAILGUN_FROM_NAME} <${MAILGUN_FROM_EMAIL}>`,
    to: [to],
    subject,
    text: text || `Please find your invoice attached.\n\nThank you for your business!`,
    html: html || `<p>Please find your invoice attached.</p><p>Thank you for your business!</p>`,
    attachment: [
      {
        filename: pdfFilename,
        data: Buffer.from(pdfBuffer),
      },
    ],
  }

  try {
    const response = await client.messages.create(MAILGUN_DOMAIN!, messageData)
    return response
  } catch (error: any) {
    throw new Error(`Failed to send invoice email: ${error.message || 'Unknown error'}`)
  }
}
