import axios from 'axios'

const INVOICING_API_URL = process.env.INVOICING_API_URL || 'https://dev.invoicingapi.com/v1/invoice/createinvoice'
const INVOICING_API_KEY = process.env.INVOICING_API_KEY

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface RecipientAddress {
  name: string
  email: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  telephone?: string
}

/** Issuer/sender address shown on the invoice (your business). */
export interface IssuerAddress {
  name?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  telephone?: string
  email?: string
}

/** Default issuer/sender address shown on generated invoices. */
export const DEFAULT_ISSUER_ADDRESS: IssuerAddress = {
  name: 'AM Interiors',
  addressLine1: '123 street ave',
  addressLine2: 'Bellingham, MA',
}

export interface InvoiceData {
  template?: string
  color?: string
  documentType?: string
  fontSize?: number
  invoiceNumber: string
  issueDate: string
  dueDate?: string
  recipientAddress: RecipientAddress
  lineItems: InvoiceLineItem[]
  currency?: string
  notes?: string
  isPaid?: boolean
  issuerAddress?: IssuerAddress
}

/**
 * Generate an invoice PDF using InvoicingAPI
 * @param invoiceData - The invoice data to generate
 * @returns PDF buffer as ArrayBuffer
 */
export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<ArrayBuffer> {
  if (!INVOICING_API_KEY) {
    throw new Error('INVOICING_API_KEY environment variable is not set')
  }

  try {
    const response = await axios.post(INVOICING_API_URL, invoiceData, {
      headers: {
        'ApiKey': INVOICING_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer', // Expect PDF binary data
    })

    if (response.status !== 200) {
      throw new Error(`InvoicingAPI returned status ${response.status}`)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data 
        ? Buffer.from(error.response.data).toString('utf-8')
        : error.message
      throw new Error(`Failed to generate invoice PDF: ${errorMessage}`)
    }
    throw error
  }
}
