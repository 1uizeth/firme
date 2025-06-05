import React, { type PropsWithChildren } from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import ScrollToTop from "@/components/utils/scroll-to-top"
import { ReclaimProvider } from "@/contexts/reclaim-context"

import { Providers } from "@/components/providers"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700"],
})

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "Reclaim",
  description: "Cryptographic identity recovery and breach alerts.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen bg-white font-sans antialiased text-black", fontSans.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <Providers>
            <ReclaimProvider>
              <ScrollToTop />
                {children}
            </ReclaimProvider>
        </Providers>
      </body>
    </html>
  )
}
