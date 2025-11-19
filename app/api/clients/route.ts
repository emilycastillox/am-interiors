import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        invoices: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        notes,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
