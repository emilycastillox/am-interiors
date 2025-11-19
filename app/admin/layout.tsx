import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}>
      {children}
    </div>
  )
}
