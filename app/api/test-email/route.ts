import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/mailgun'

/**
 * POST /api/test-email
 * Send a test email using Mailgun
 * 
 * Request body:
 * {
 *   "to": "recipient@example.com",
 *   "subject": "Test Email" (optional),
 *   "text": "Email body text" (optional),
 *   "html": "<h1>Email body HTML</h1>" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, text, html } = body

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email address (to) is required' },
        { status: 400 }
      )
    }

    // Validate email format (supports "NAME <email@example.com>" or "email@example.com")
    const emailRegex = /^(.+?)\s*<(.+?)>$|^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address format. Use "NAME <email@example.com>" or "email@example.com"' },
        { status: 400 }
      )
    }

    // Check if API key is set (for debugging)
    if (!process.env.MAILGUN_API_KEY) {
      return NextResponse.json(
        { 
          error: 'MAILGUN_API_KEY environment variable is not set',
          hint: 'Make sure you have set MAILGUN_API_KEY in your .env.local file'
        },
        { status: 500 }
      )
    }

    // Send test email using Mailgun (following Mailgun.js docs structure)
    const response = await sendTestEmail(
      to,
      subject,
      text,
      html
    )

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      mailgunResponse: response,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error sending test email:', error)
    const details = error.message || ''
    const isUnauthorized = details.includes('Unauthorized') || details.includes('401')
    const domainUsed = process.env.MAILGUN_DOMAIN || '(not set)'
    const baseUrlUsed = process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net'
    const hint = isUnauthorized
      ? ` Domain: "${domainUsed}", API base: ${baseUrlUsed}. For 401: Use the Private API key from Mailgun (Sending → Domain settings → API Keys, or Sending → API Keys). Do not use the Public key or HTTP webhook signing key. MAILGUN_DOMAIN must match the domain name shown in Sending → Domains exactly (e.g. aminteriors.studio or sandboxXXX.mailgun.org).`
      : ''
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error.message + hint,
      },
      { status: 500 }
    )
  }
}
