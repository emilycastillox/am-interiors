import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all payments
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        client: true,
        invoice: true,
      },
      orderBy: {
        paymentDate: 'desc',
      },
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

// POST create new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, invoiceId, amount, paymentDate, method, notes } = body

    if (!clientId || !amount) {
      return NextResponse.json(
        { error: 'Client ID and amount are required' },
        { status: 400 }
      )
    }

    const payment = await prisma.payment.create({
      data: {
        clientId,
        invoiceId: invoiceId || null,
        amount: parseFloat(amount),
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        method,
        notes,
      },
      include: {
        client: true,
        invoice: true,
      },
    })

    // Update invoice status if payment is for an invoice
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
      })

      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
        const newStatus = totalPaid >= invoice.amount ? 'paid' : 'pending'
        
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: newStatus },
        })
      }
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
