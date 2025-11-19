"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, FileText, DollarSign, TrendingUp, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalPayments: 0,
    pendingInvoices: 0,
  })

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

  useEffect(() => {
    // Fetch dashboard stats
    Promise.all([
      fetch("/api/clients").then((res) => res.json()),
      fetch("/api/invoices").then((res) => res.json()),
      fetch("/api/payments").then((res) => res.json()),
    ])
      .then(([clients, invoices, payments]) => {
        setStats({
          totalClients: clients.length || 0,
          totalInvoices: invoices.length || 0,
          totalPayments: payments.length || 0,
          pendingInvoices: invoices.filter((inv: any) => inv.status === "pending").length || 0,
        })
      })
      .catch((error) => console.error("Error fetching stats:", error))
  }, [])

  return (
    <div className="min-h-screen bg-background p-8" style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage clients, invoices, and payments</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Clients</p>
                <p className="text-3xl font-light text-foreground">{stats.totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
                <p className="text-3xl font-light text-foreground">{stats.totalInvoices}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Invoices</p>
                <p className="text-3xl font-light text-foreground">{stats.pendingInvoices}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Payments</p>
                <p className="text-3xl font-light text-foreground">{stats.totalPayments}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/clients">
            <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer h-full">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-light text-foreground mb-2">Clients</h2>
              <p className="text-muted-foreground">Manage your client database</p>
            </Card>
          </Link>

          <Link href="/admin/invoices">
            <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer h-full">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-light text-foreground mb-2">Invoices</h2>
              <p className="text-muted-foreground">Create and track invoices</p>
            </Card>
          </Link>

          <Link href="/admin/payments">
            <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer h-full">
              <DollarSign className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-light text-foreground mb-2">Payments</h2>
              <p className="text-muted-foreground">Track client payments</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
