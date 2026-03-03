import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoicePDF, type InvoiceData, type InvoiceLineItem } from '@/lib/invoicingapi'
import { sendInvoiceEmail } from '@/lib/mailgun'

// GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, invoiceNumber, amount, status, dueDate, description, lineItems, skipEmail } = body

    if (!clientId || !invoiceNumber || !amount) {
      return NextResponse.json(
        { error: 'Client ID, invoice number, and amount are required' },
        { status: 400 }
      )
    }

    // Create invoice in database
    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        invoiceNumber,
        amount: parseFloat(amount),
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        description,
      },
      include: {
        client: true,
      },
    })

    let emailSent = false
    // Generate invoice PDF and send email (if not skipped)
    if (!skipEmail && invoice.client.email) {
      try {
        // Prepare line items - use provided lineItems or create from amount/description
        const invoiceLineItems: InvoiceLineItem[] = lineItems && Array.isArray(lineItems) && lineItems.length > 0
          ? lineItems.map((item: any) => ({
              description: item.description || item.name || 'Service',
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || item.price || parseFloat(amount),
            }))
          : [{
              description: description || 'Invoice',
              quantity: 1,
              unitPrice: parseFloat(amount),
            }]

        // Prepare invoice data for InvoicingAPI
        const invoiceData: InvoiceData = {
          template: 'business3', // Default template, can be customized
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
          currency: 'USD', // Default currency, can be made configurable
          notes: description || undefined,
          isPaid: invoice.status === 'paid',
        }

        // Generate invoice PDF
        const pdfBuffer = await generateInvoicePDF(invoiceData)

        // Send invoice via email
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

        emailSent = true
        console.log(`Invoice ${invoice.invoiceNumber} generated and sent to ${invoice.client.email}`)
      } catch (emailError: any) {
        // Log error but don't fail the invoice creation
        console.error('Error generating invoice PDF or sending email:', emailError)
        // You might want to store this error in the database or send to an error tracking service
      }
    } else if (!skipEmail && !invoice.client.email) {
      console.warn(`Invoice ${invoice.invoiceNumber} created but client has no email address`)
    }

    return NextResponse.json({ invoice, emailSent }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
