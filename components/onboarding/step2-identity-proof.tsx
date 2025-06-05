"use client"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react" // Placeholder icon

interface Step2IdentityProofProps {
  onNextStep: () => void
  onBack?: () => void
  currentStep: number
  totalSteps: number
}

// In a real app, this would be securely generated
const generatedPassphrase = "synergy-quantum-beacon-horizon-echo"

export default function Step2IdentityProof({ onNextStep, onBack, currentStep, totalSteps }: Step2IdentityProofProps) {
  return (
    <OnboardingLayout 
      stepNumber={currentStep} 
      totalSteps={totalSteps} 
      headerText="Verify"
      onBack={onBack}
      showBackButton={true}
    >
      <p className="text-neutral-700 mb-6 text-lg">Record your identity proof</p>

      {/* Placeholder for video recording interface */}
      <div className="w-full h-48 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center mb-6">
        <Video className="w-16 h-16 text-neutral-400 mb-2" />
        <p className="text-neutral-500 text-sm">Video Recording Area</p>
      </div>

      <div className="mb-8 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
        <p className="font-mono text-black text-center text-lg tracking-wider">{generatedPassphrase}</p>
      </div>

      <Button
        onClick={onNextStep}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        aria-label="Record identity proof"
      >
        Record
      </Button>
    </OnboardingLayout>
  )
}
