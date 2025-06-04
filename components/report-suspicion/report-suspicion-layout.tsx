import type React from "react"

interface ReportSuspicionLayoutProps {
  headerText: string
  children: React.ReactNode
  currentStep?: number
  totalSteps?: number
  contextText?: string
  timestamp?: string
}

export default function ReportSuspicionLayout({
  headerText,
  children,
  currentStep,
  totalSteps,
  contextText,
  timestamp,
}: ReportSuspicionLayoutProps) {
  return (
    <div className="w-full max-w-lg text-center">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">{headerText}</h1>
        {contextText && <p className="text-md text-neutral-600 mt-2">{contextText}</p>}
        {timestamp && <p className="font-mono text-xs text-neutral-500 mt-1">{timestamp}</p>}
      </header>
      <main className="mb-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">{children}</main>
      {currentStep && totalSteps && (
        <footer className="font-mono text-sm text-neutral-600">
          Step {currentStep} of {totalSteps}
        </footer>
      )}
    </div>
  )
}
