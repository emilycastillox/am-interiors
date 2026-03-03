import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/test-mailgun-config
 * Diagnostic endpoint to check Mailgun configuration (without exposing full API key)
 */
export async function GET() {
  const config = {
    hasApiKey: !!process.env.MAILGUN_API_KEY,
    apiKeyLength: process.env.MAILGUN_API_KEY?.length || 0,
    apiKeyPrefix: process.env.MAILGUN_API_KEY?.substring(0, 4) || 'N/A',
    domain: process.env.MAILGUN_DOMAIN || null,
    baseUrl: process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net',
    fromEmail: process.env.MAILGUN_FROM_EMAIL || (process.env.MAILGUN_DOMAIN ? `noreply@${process.env.MAILGUN_DOMAIN}` : null),
    fromName: process.env.MAILGUN_FROM_NAME || 'AM Interiors',
  }

  return NextResponse.json({
    message: 'Mailgun configuration check',
    config,
    issues: [
      !config.hasApiKey && 'MAILGUN_API_KEY is not set',
      !config.domain && 'MAILGUN_DOMAIN is not set (required; use your domain from Mailgun Sending → Domains)',
      config.apiKeyLength < 20 && 'API key seems too short (should be ~40+ characters)',
      !config.apiKeyPrefix.startsWith('key-') && config.apiKeyPrefix !== 'N/A' && 'API key should start with "key-"',
    ].filter(Boolean),
  })
}
