import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const theseasons = localFont({
  src: [
    {
      path: "./fonts/Fontspring-DEMO-theseasons-lt.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Fontspring-DEMO-theseasons-ltit.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Fontspring-DEMO-theseasons-reg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Fontspring-DEMO-theseasons-it.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Fontspring-DEMO-theseasons-bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Fontspring-DEMO-theseasons-bdit.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-theseasons",
  display: "swap",
})

export const metadata: Metadata = {
  title: "A:M Interiors - Sophisticated Design Studio",
  description: "Elegant interior design with sophisticated earthy aesthetics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-serif ${theseasons.variable}`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
