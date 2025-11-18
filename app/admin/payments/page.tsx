"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
}

interface Invoice {
  id: string
  invoiceNumber: string
}

interface Payment {
  id: string
  amount: number
  paymentDate: string
  method?: string
  notes?: string
  clientId: string
  invoiceId?: string
  client: Client
  invoice?: Invoice
  createdAt: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    method: "",
    notes: "",
  })

  useEffect(() => {
    fetchPayments()
    fetchClients()
    fetchInvoices()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPayment ? `/api/payments/${editingPayment.id}` : "/api/payments"
      const method = editingPayment ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          invoiceId: formData.invoiceId || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to save payment")

      toast.success(editingPayment ? "Payment updated successfully" : "Payment created successfully")
      setIsDialogOpen(false)
      resetForm()
      fetchPayments()
      fetchInvoices() // Refresh invoices to update status
    } catch (error) {
      console.error("Error saving payment:", error)
      toast.error("Failed to save payment")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const response = await fetch(`/api/payments/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete payment")

      toast.success("Payment deleted successfully")
      fetchPayments()
      fetchInvoices() // Refresh invoices to update status
    } catch (error) {
      console.error("Error deleting payment:", error)
      toast.error("Failed to delete payment")
    }
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      clientId: payment.clientId,
      invoiceId: payment.invoiceId || "",
      amount: payment.amount.toString(),
      paymentDate: payment.paymentDate.split("T")[0],
      method: payment.method || "",
      notes: payment.notes || "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      clientId: "",
      invoiceId: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      method: "",
      notes: "",
    })
    setEditingPayment(null)
  }

  const getFilteredInvoices = () => {
    if (!formData.clientId) return invoices
    return invoices.filter((inv) => inv.id === formData.invoiceId || true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading payments...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-serif font-light text-foreground">Payments</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPayment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
                <DialogDescription>
                  {editingPayment ? "Update payment information" : "Enter payment details below"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, clientId: value, invoiceId: "" })
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client *" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.invoiceId}
                  onValueChange={(value) => setFormData({ ...formData, invoiceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Invoice (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {invoices
                      .filter((inv) => inv.id === formData.invoiceId || true)
                      .map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount *"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  placeholder="Payment Date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  required
                />
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingPayment ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-serif font-light text-foreground">
                      ${payment.amount.toFixed(2)}
                    </h3>
                    {payment.method && (
                      <span className="px-2 py-1 rounded text-xs bg-accent/10 text-accent">
                        {payment.method.replace("_", " ").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">Client: {payment.client.name}</p>
                  {payment.invoice && (
                    <p className="text-muted-foreground mb-2">
                      Invoice: {payment.invoice.invoiceNumber}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">
                    Date: {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                  {payment.notes && (
                    <p className="text-sm text-muted-foreground">{payment.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(payment)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(payment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {payments.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No payments yet. Record your first payment to get started.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
