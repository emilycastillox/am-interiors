"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

      toast.success("Login successful")
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center p-8" 
      style={{ 
        fontFamily: 'var(--font-open-sans), sans-serif',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}
    >
      <Card className="w-full max-w-md p-8" style={{ backgroundColor: 'hsl(var(--card))' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2" style={{ color: 'hsl(var(--foreground))' }}>Admin Login</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Enter your credentials to access the CRM</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
