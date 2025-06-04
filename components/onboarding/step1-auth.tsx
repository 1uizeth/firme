"use client"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"

interface Step1AuthProps {
  onNextStep: () => void
  currentStep: number
  totalSteps: number
}

export default function Step1Auth({ onNextStep, currentStep, totalSteps }: Step1AuthProps) {
  return (
    <OnboardingLayout stepNumber={currentStep} totalSteps={totalSteps} headerText="Authenticate">
      <p className="text-neutral-700 mb-8 text-lg">Connect your identity</p>
      <Button
        onClick={onNextStep}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        aria-label="Sign in with Civic"
      >
        Sign in with Civic
      </Button>
    </OnboardingLayout>
  )
}
