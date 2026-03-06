# Invoice Integration Guide

This document explains how the invoice generation and email sending integration works.

## Overview

When an invoice is created in the CRM, the system automatically:
1. Saves the invoice to the database
2. Generates a PDF invoice using InvoicingAPI
3. Sends the invoice PDF to the client via Mailgun

## How It Works

### Invoice Creation Flow

1. **User creates invoice** in `/admin/invoices`
2. **Invoice is saved** to the database
3. **PDF is generated** via InvoicingAPI with the invoice details
4. **Email is sent** to the client's email address with the PDF attached

### API Endpoints

- **POST /api/invoices** – Create invoice; optionally generates PDF and sends email (unless `skipEmail: true` or client has no email). Returns `{ invoice, emailSent }`.
- **POST /api/invoices/[id]/send** – Resend invoice: generate PDF and send to client email. Use for existing invoices. Returns `{ message, emailSent }` or 400 if client has no email.

### Request Body

The invoice creation accepts the following fields:
- `clientId` (required) - ID of the client
- `invoiceNumber` (required) - Unique invoice number
- `amount` (required) - Invoice amount
- `status` (optional) - Invoice status (default: "pending")
- `dueDate` (optional) - Due date (ISO date string)
- `description` (optional) - Invoice description/notes
- `lineItems` (optional) - Array of line items. If not provided, a single line item is created from amount/description
- `skipEmail` (optional) - Set to `true` to skip PDF generation and email sending

### Line Items Format

If you want to provide custom line items, use this format:

```json
{
  "lineItems": [
    {
      "description": "Interior Design Consultation",
      "quantity": 2,
      "unitPrice": 150.00
    },
    {
      "description": "Furniture Selection",
      "quantity": 1,
      "unitPrice": 500.00
    }
  ]
}
```

If `lineItems` is not provided, a single line item will be created:
- Description: The invoice `description` field or "Invoice"
- Quantity: 1
- Unit Price: The invoice `amount`

## Environment Variables

See `VERCEL_ENV_VARS.md` for complete environment variable setup.

**Required for full functionality:**
- `INVOICING_API_KEY` - Your InvoicingAPI key
- `MAILGUN_API_KEY` - Your Mailgun API key
- `MAILGUN_DOMAIN` - Your verified Mailgun domain

**Optional:**
- `INVOICING_API_URL` - Custom InvoicingAPI URL (default provided)
- `MAILGUN_FROM_EMAIL` - Sender email (default: `noreply@${MAILGUN_DOMAIN}`)
- `MAILGUN_FROM_NAME` - Sender name (default: "AM Interiors")

## Error Handling

- If PDF generation fails, the invoice is still created in the database, but an error is logged
- If email sending fails, the invoice is still created, but an error is logged
- If the client has no email address, a warning is logged and email sending is skipped
- All errors are logged to the console for debugging

## Testing

### 1. Set up environment variables

Create or edit `.env.local` in the project root with at least:

```bash
DATABASE_URL="postgresql://..."   # your Supabase URL
INVOICING_API_KEY="your_key"     # from invoicingapi.com
MAILGUN_API_KEY="your_key"       # from Mailgun (Sending → API Keys)
MAILGUN_DOMAIN="sandbox....mailgun.org"   # or your verified domain
```

**Mailgun sandbox:** You can only send to **authorized recipients**. In Mailgun: **Sending** → **Authorized Recipients** → add the email you want to test with.

### 2. Verify Mailgun config (optional)

Start the app (`npm run dev`), then open or curl:

```bash
curl http://localhost:3000/api/test-mailgun-config
```

Check that `hasApiKey` is true and `issues` is empty (or fix what it reports).

### 3. Send a test email (optional)

Proves Mailgun works before testing invoices:

```bash
# Using the script (edit test-email.sh to use your email)
./test-email.sh

# Or with curl (replace with your authorized recipient)
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "you@example.com", "subject": "Test", "text": "Hello"}'
```

### 4. UI testing steps (admin flow)

Use this checklist to test the full invoice + email flow in the admin UI.

**Prerequisites**

- App running (`npm run dev`), `.env` has `DATABASE_URL`, `INVOICING_API_KEY`, `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`.
- For Mailgun sandbox: add the test recipient in **Sending → Authorized Recipients**.

**Steps**

1. **Log in**  
   Open **http://localhost:3000/admin/login** and sign in.

2. **Create a client with email**  
   Go to **Clients** (or **Dashboard** → Clients). Add a client and set **Email** to an address you can access (and that is an authorized recipient if using sandbox). Save.

3. **Create an invoice and send email**  
   Go to **Invoices** → **Add Invoice**.  
   - Select the client you just created.  
   - Enter **Invoice number** (e.g. `INV-001`) and **Amount** (e.g. `500`).  
   - Leave **Skip sending email** **unchecked**.  
   - Click **Create**.  
   - **Expected:** Toast: **Invoice created and email sent to client**.  
   - **Verify:** Inbox (and spam) for the client’s email has a message from AM Interiors with a PDF attachment.

4. **Test “Skip sending email”**  
   **Invoices** → **Add Invoice**.  
   - Pick a client, new invoice number (e.g. `INV-002`), amount.  
   - **Check** **Skip sending email**.  
   - Click **Create**.  
   - **Expected:** Toast: **Invoice created (email not sent)**. No email should be sent.

5. **Test resend (mail icon)**  
   On the **Invoices** list, find an existing invoice for a client that has an email.  
   - Click the **mail (envelope) icon** on that row.  
   - **Expected:** Toast: **Invoice sent to &lt;client email&gt;**.  
   - **Verify:** Client receives another email with the PDF.

6. **Test client with no email**  
   **Clients** → create (or edit) a client and **leave Email blank**. Save.  
   **Invoices** → create an invoice for that client.  
   - **Expected:** Toast indicates invoice created (email not sent).  
   On the **Invoices** list, for that invoice the **mail icon** should be **disabled**; tooltip: **Client has no email**.

7. **Optional: Edit invoice**  
   On the Invoices list, click the **pencil (Edit)** icon, change amount or description, click **Update**.  
   - **Expected:** Toast: **Invoice updated successfully**. (No new email is sent on update.)

## Skipping Email

To create an invoice without generating PDF or sending email, include `skipEmail: true` in the request body:

```json
{
  "clientId": "...",
  "invoiceNumber": "INV-001",
  "amount": 1000,
  "skipEmail": true
}
```

## Customization

### Invoice Template

The default invoice template is `business3`. To customize, modify the `template` field in `app/api/invoices/route.ts`:

```typescript
const invoiceData: InvoiceData = {
  template: 'your-template-name', // Change this
  // ... other fields
}
```

### Email Content

To customize the email content, modify the `text` and `html` fields in the `sendInvoiceEmail` call in `app/api/invoices/route.ts`.

## Troubleshooting

### Invoice created but no email received
- Check that `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` are set correctly
- Verify the client has an email address in the database
- Check Vercel function logs for error messages
- Verify your Mailgun domain is verified and DNS is configured

### PDF generation fails (e.g. "Unauthorized client" / 401)
- **401 Unauthorized client:** Your `INVOICING_API_KEY` in `.env` is missing, wrong, or inactive. Get the key from [invoicingapi.com](https://invoicingapi.com) (dashboard or API settings) and set `INVOICING_API_KEY` in `.env`. Restart the dev server after changing.
- Check that your InvoicingAPI account is active
- Check the invoice data format matches InvoicingAPI requirements
- Review server logs for the full error message

### Email sent but attachment missing
- Check Mailgun logs in your dashboard
- Verify the PDF buffer is being generated correctly
- Check attachment size limits (Mailgun has a 25MB limit)
