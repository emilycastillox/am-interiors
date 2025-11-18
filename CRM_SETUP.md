# CRM Setup Guide

## Overview

The CRM system has been set up with the following features:

- **Client Management**: Full CRUD operations for clients
- **Invoice Management**: Create, track, and manage invoices
- **Payment Tracking**: Record and track client payments
- **Dashboard**: Overview of all CRM metrics

## Database Setup (Supabase)

1. Follow the instructions in `SUPABASE_SETUP.md` to set up your Supabase database
2. Create a `.env` file with your `DATABASE_URL`
3. Run the following commands:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push
```

## Accessing the CRM

Once set up, you can access the CRM at:
- **Dashboard**: `/admin`
- **Clients**: `/admin/clients`
- **Invoices**: `/admin/invoices`
- **Payments**: `/admin/payments`

## Features

### Client Management
- Add new clients with name, email, phone, address, and notes
- Edit existing client information
- Delete clients (cascades to related invoices and payments)
- View all clients in a card-based layout

### Invoice Management
- Create invoices linked to clients
- Track invoice status (pending, paid, overdue)
- Set due dates and descriptions
- Automatic status updates when payments are recorded

### Payment Tracking
- Record payments for clients
- Link payments to specific invoices (optional)
- Track payment methods (cash, check, credit card, bank transfer)
- Automatic invoice status updates when payments are made

## Next Steps: Adding Authentication

Once you're ready to add authentication with Clerk:

1. Install Clerk:
```bash
npm install @clerk/nextjs
```

2. Add Clerk environment variables to `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
```

3. Wrap the admin routes with Clerk authentication middleware

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a client
- `GET /api/clients/[id]` - Get a specific client
- `PUT /api/clients/[id]` - Update a client
- `DELETE /api/clients/[id]` - Delete a client

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create an invoice
- `GET /api/invoices/[id]` - Get a specific invoice
- `PUT /api/invoices/[id]` - Update an invoice
- `DELETE /api/invoices/[id]` - Delete an invoice

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create a payment
- `GET /api/payments/[id]` - Get a specific payment
- `PUT /api/payments/[id]` - Update a payment
- `DELETE /api/payments/[id]` - Delete a payment

## Database Schema

The database includes three main tables:

1. **clients**: Stores client information
2. **invoices**: Stores invoice data linked to clients
3. **payments**: Stores payment records linked to clients and optionally invoices

All relationships are properly configured with cascade deletes to maintain data integrity.
