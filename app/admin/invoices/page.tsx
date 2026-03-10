"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, ArrowLeft, LogOut, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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

interface Client {
  id: string
  name: string
  email?: string | null
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: string
  dueDate?: string
  description?: string
  clientId: string
  client: Client
  createdAt: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: "",
    amount: "",
    status: "pending",
    dueDate: "",
    description: "",
    skipEmail: false,
  })
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
    fetchClients()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast.error("Failed to load invoices")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = editingInvoice ? `/api/invoices/${editingInvoice.id}` : "/api/invoices"
      const method = editingInvoice ? "PUT" : "POST"
      const body = editingInvoice
        ? { clientId: formData.clientId, invoiceNumber: formData.invoiceNumber, amount: formData.amount, status: formData.status, dueDate: formData.dueDate || null, description: formData.description }
        : { ...formData, dueDate: formData.dueDate || null, skipEmail: formData.skipEmail }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error("Failed to save invoice")

      const data = await response.json()
      if (!editingInvoice && data.emailSent) {
        toast.success("Invoice created and email sent to client")
      } else if (!editingInvoice && data.emailError) {
        toast.error(`Invoice created but PDF/email failed: ${data.emailError}`)
      } else if (!editingInvoice && data.emailSent === false) {
        toast.success("Invoice created (email not sent)")
      } else {
        toast.success(editingInvoice ? "Invoice updated successfully" : "Invoice created successfully")
      }
      setIsDialogOpen(false)
      resetForm()
      fetchInvoices()
    } catch (error) {
      console.error("Error saving invoice:", error)
      toast.error("Failed to save invoice")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete invoice")

      toast.success("Invoice deleted successfully")
      fetchInvoices()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete invoice")
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      const invoice = invoices.find((inv) => inv.id === invoiceId)
      if (!invoice) return

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: invoice.clientId,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount,
          status: newStatus,
          dueDate: invoice.dueDate,
          description: invoice.description,
        }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast.success("Status updated successfully")
      fetchInvoices()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleSendEmail = async (invoice: Invoice) => {
    setSendingEmailId(invoice.id)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to send email")
      toast.success(`Invoice sent to ${invoice.client.email}`)
    } catch (error) {
      console.error("Error sending invoice email:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send invoice email")
    } finally {
      setSendingEmailId(null)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      clientId: invoice.clientId,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount.toString(),
      status: invoice.status,
      dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
      description: invoice.description || "",
      skipEmail: false,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      clientId: "",
      invoiceNumber: "",
      amount: "",
      status: "pending",
      dueDate: "",
      description: "",
      skipEmail: false,
    })
    setEditingInvoice(null)
  }

  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Logout failed")

      toast.success("Logged out successfully")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center" style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8" style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-light text-foreground">Invoices</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
              <DialogHeader>
                <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
                <DialogDescription>
                  {editingInvoice ? "Update invoice information" : "Enter invoice details below"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                  required
                >
                  <SelectTrigger style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                    <SelectValue placeholder="Select Client *" />
                  </SelectTrigger>
                  <SelectContent style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Invoice Number *"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount *"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Due Date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {!editingInvoice && (
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skipEmail}
                      onChange={(e) => setFormData({ ...formData, skipEmail: e.target.checked })}
                      className="rounded border-input"
                    />
                    Skip sending email to client
                  </label>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingInvoice ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingInvoice ? "Update" : "Create"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{invoice.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{invoice.client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">${invoice.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={invoice.status}
                      onValueChange={(value) => handleStatusChange(invoice.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-7 border-0 shadow-none hover:opacity-80 focus:ring-0" style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                        <SelectValue>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
                        <SelectItem value="pending">PENDING</SelectItem>
                        <SelectItem value="paid">PAID</SelectItem>
                        <SelectItem value="overdue">OVERDUE</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">{invoice.description || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendEmail(invoice)}
                        disabled={sendingEmailId === invoice.id || !invoice.client?.email}
                        title={invoice.client.email ? "Send invoice by email" : "Client has no email"}
                      >
                        {sendingEmailId === invoice.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(invoice)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(invoice.id)}
                        disabled={deletingId === invoice.id}
                      >
                        {deletingId === invoice.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No invoices yet. Create your first invoice to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}