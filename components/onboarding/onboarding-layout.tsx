import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { WalletStatusHeader } from "@/components/wallet-status"

interface OnboardingLayoutProps {
  stepNumber: number
  totalSteps: number
  headerText: string
  children: React.ReactNode
  onBack?: () => void
  showBackButton?: boolean
}

export default function OnboardingLayout({ 
  stepNumber, 
  totalSteps, 
  headerText, 
  children,
  onBack,
  showBackButton = true
}: OnboardingLayoutProps) {
  return (
    <>
      <WalletStatusHeader />
      <div className="w-full max-w-md text-center mt-16">
        <header className="mb-12 relative">
          {showBackButton && stepNumber > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}
          <h1 className="text-4xl font-bold text-black">{headerText}</h1>
        </header>
        <main className="mb-12">{children}</main>
        <footer className="font-mono text-sm text-neutral-600">
          Step {stepNumber} of {totalSteps}
        </footer>
      </div>
    </>
  )
}
