import type React from "react"

interface SecurityReviewLayoutProps {
  headerText: string
  children: React.ReactNode
  contextText?: string
}

export default function SecurityReviewLayout({ headerText, children, contextText }: SecurityReviewLayoutProps) {
  return (
    <div className="w-full max-w-lg">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">{headerText}</h1>
        {contextText && <p className="text-md text-neutral-600 mt-2">{contextText}</p>}
      </header>
      <main className="bg-white p-6 sm:p-8 rounded-lg shadow-md">{children}</main>
    </div>
  )
}
