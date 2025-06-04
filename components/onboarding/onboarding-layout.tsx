import type React from "react"

interface OnboardingLayoutProps {
  stepNumber: number
  totalSteps: number
  headerText: string
  children: React.ReactNode
}

export default function OnboardingLayout({ stepNumber, totalSteps, headerText, children }: OnboardingLayoutProps) {
  return (
    <div className="w-full max-w-md text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-black">{headerText}</h1>
      </header>
      <main className="mb-12">{children}</main>
      <footer className="font-mono text-sm text-neutral-600">
        Step {stepNumber} of {totalSteps}
      </footer>
    </div>
  )
}
