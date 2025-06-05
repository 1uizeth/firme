"use client"
import { useState } from "react"
import MyUserButton from "../my-user-button"
import OnboardingLayout from "./onboarding-layout"
import { WalletConnect } from "../wallet-connect"

interface Step1AuthProps {
  onNextStep: () => void
  onBack?: () => void
  currentStep: number
  totalSteps: number
}

export default function Step1Auth({ onNextStep, onBack, currentStep, totalSteps }: Step1AuthProps) {
  const [showWallet, setShowWallet] = useState(false);

  return (
    <OnboardingLayout 
      stepNumber={currentStep} 
      totalSteps={totalSteps} 
      headerText="Authenticate"
      onBack={onBack}
      showBackButton={true}
    >
      <p className="text-neutral-700 mb-8 text-lg">Connect your identity</p>
      <MyUserButton 
        className="w-full"
        isClicked={showWallet} 
        onToggleClick={(isClicked) => setShowWallet(isClicked)} 
      />
      {showWallet && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Connect with MetaMask</h2>
          <WalletConnect 
            onNextStep={onNextStep}
          />
        </div>
      )}
    </OnboardingLayout>
  )
}
