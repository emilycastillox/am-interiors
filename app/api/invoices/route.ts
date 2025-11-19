import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const { clientId, invoiceNumber, amount, status, dueDate, description } = body

    if (!clientId || !invoiceNumber || !amount) {
      return NextResponse.json(
        { error: 'Client ID, invoice number, and amount are required' },
        { status: 400 }
      )
    }

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

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
