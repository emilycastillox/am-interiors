import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoicePDF, DEFAULT_ISSUER_ADDRESS, type InvoiceData, type InvoiceLineItem } from '@/lib/invoicingapi'
import { sendInvoiceEmail } from '@/lib/mailgun'

/**
 * POST /api/invoices/[id]/send
 * Generate invoice PDF and send it to the client by email.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { client: true },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (!invoice.client.email) {
      return NextResponse.json(
        { error: 'Client has no email address' },
        { status: 400 }
      )
    }

    const invoiceLineItems: InvoiceLineItem[] = [
      {
        description: invoice.description || 'Invoice',
        quantity: 1,
        unitPrice: invoice.amount,
      },
    ]

    const invoiceData: InvoiceData = {
      template: 'business3',
      color: 'black',
      documentType: 'a4',
      fontSize: 11,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.createdAt.toISOString().split('T')[0],
      dueDate: invoice.dueDate ? invoice.dueDate.toISOString().split('T')[0] : undefined,
      recipientAddress: {
        name: invoice.client.name,
        email: invoice.client.email,
        addressLine1: invoice.client.address || undefined,
        telephone: invoice.client.phone || undefined,
      },
      lineItems: invoiceLineItems,
      currency: 'USD',
      notes: invoice.description || undefined,
      isPaid: invoice.status === 'paid',
      issuerAddress: DEFAULT_ISSUER_ADDRESS,
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData)

    await sendInvoiceEmail({
      to: invoice.client.email,
      subject: `Invoice #${invoice.invoiceNumber} from AM Interiors`,
      pdfBuffer,
      pdfFilename: `invoice-${invoice.invoiceNumber}.pdf`,
      text: `Dear ${invoice.client.name},\n\nPlease find attached your invoice #${invoice.invoiceNumber}.\n\nAmount: $${invoice.amount.toFixed(2)}\n${invoice.dueDate ? `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n` : ''}\nThank you for your business!\n\nBest regards,\nAM Interiors`,
      html: `
        <p>Dear ${invoice.client.name},</p>
        <p>Please find attached your invoice #${invoice.invoiceNumber}.</p>
        <p><strong>Amount:</strong> $${invoice.amount.toFixed(2)}<br>
        ${invoice.dueDate ? `<strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}<br>` : ''}</p>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>AM Interiors</p>
      `,
    })

    return NextResponse.json({
      message: `Invoice sent to ${invoice.client.email}`,
      emailSent: true,
    })
  } catch (error) {
    console.error('Error sending invoice email:', error)
    const message = error instanceof Error ? error.message : 'Failed to send invoice email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
