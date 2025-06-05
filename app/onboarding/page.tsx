"use client"

import { useState } from "react"
import Step1Auth from "@/components/onboarding/step1-auth"
import Step2IdentityProof from "@/components/onboarding/step2-identity-proof"
import Step3EmergencyContacts from "@/components/onboarding/step3-emergency-contacts"
import CompletionScreen from "@/components/onboarding/completion-screen"

const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === TOTAL_STEPS) {
      // Move to completion screen
      setCurrentStep(TOTAL_STEPS + 1)
    }
  }

  // In a real app, you might want a back button
  // const handlePreviousStep = () => {
  //   if (currentStep > 1 && currentStep <= TOTAL_STEPS) {
  //     setCurrentStep((prev) => prev - 1);
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Auth onNextStep={handleNextStep} currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      case 2:
        return <Step2IdentityProof onNextStep={handleNextStep} currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      case 3:
        return <Step3EmergencyContacts onComplete={handleNextStep} currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      case TOTAL_STEPS + 1:
        return <CompletionScreen />
      default:
        return <Step1Auth onNextStep={handleNextStep} currentStep={1} totalSteps={TOTAL_STEPS} />
    }
  }

  return <div className="flex flex-col items-center justify-center min-h-dvh bg-white p-4">{renderStep()}</div>
}
