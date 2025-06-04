import type React from "react"

interface ContactVerificationLayoutProps {
  headerText: string
  children: React.ReactNode
  footerText?: string // Optional footer like step count
}

export default function ContactVerificationLayout({
  headerText,
  children,
  footerText,
}: ContactVerificationLayoutProps) {
  return (
    <div className="w-full max-w-md text-center">
      <header className="mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">{headerText}</h1>
      </header>
      <main className="mb-10 sm:mb-12">{children}</main>
      {footerText && <footer className="font-mono text-xs sm:text-sm text-neutral-600">{footerText}</footer>}
    </div>
  )
}
