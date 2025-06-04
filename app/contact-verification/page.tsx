"use client"

import { useState } from "react"
import InvitationEntryScreen from "@/components/contact-verification/invitation-entry-screen"
import InvitationConfirmedScreen from "@/components/contact-verification/invitation-confirmed-screen"
import ContactAuthenticationScreen from "@/components/contact-verification/contact-authentication-screen"
import RelationshipSetupScreen from "@/components/contact-verification/relationship-setup-screen"
import ContactSetupCompleteScreen from "@/components/contact-verification/contact-setup-complete-screen"

const TOTAL_STEPS = 4 // Entry, Confirmed (implicit step), Auth, Relationship, Complete

export default function ContactVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [invitationCode, setInvitationCode] = useState("")
  // Mock: In a real app, this would come from the backend after code verification
  const [userNameWhoInvited, setUserNameWhoInvited] = useState("Alex Johnson")
  const [relationship, setRelationship] = useState<string | null>(null)

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  // Modified mock function: any 6-digit code will work
  // The InvitationEntryScreen already validates for 6 digits before calling this.
  const verifyInvitationCode = async (code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, as long as a code is passed (and it's 6 digits per component validation), consider it valid.
        // In a real app, you'd fetch the user's name who invited based on the code.
        // For demo purposes, we can use a static name or a list of names.
        const mockInviterNames = ["Sarah Chen", "Michael Lee", "Dr. Evelyn Reed", "The Reclaim Team"]
        setUserNameWhoInvited(mockInviterNames[Math.floor(Math.random() * mockInviterNames.length)])
        resolve(true)
      }, 1000) // Simulate network delay
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Invitation Entry
        return (
          <InvitationEntryScreen
            onCodeVerified={(verifiedCode) => {
              setInvitationCode(verifiedCode)
              handleNextStep() // Move to Confirmed Screen (implicitly step 2)
            }}
            verifyCodeFunction={verifyInvitationCode}
          />
        )
      case 2: // Invitation Confirmed
        return (
          <InvitationConfirmedScreen
            userNameWhoInvited={userNameWhoInvited}
            onAcceptRole={handleNextStep} // Move to Authentication
          />
        )
      case 3: // Contact Authentication
        return (
          <ContactAuthenticationScreen
            userNameWhoInvited={userNameWhoInvited}
            onAuthenticated={handleNextStep} // Move to Relationship Setup
          />
        )
      case 4: // Relationship Setup
        return (
          <RelationshipSetupScreen
            userNameWhoInvited={userNameWhoInvited}
            onRelationshipSet={(rel) => {
              setRelationship(rel)
              handleNextStep() // Move to Complete Screen
            }}
          />
        )
      case 5: // Contact Setup Complete
        return (
          <ContactSetupCompleteScreen
            userNameWhoInvited={userNameWhoInvited}
            // In a real app, you might pass the actual user status from context or API
            userCurrentStatus="Currently Safe"
          />
        )
      default:
        return <InvitationEntryScreen onCodeVerified={handleNextStep} verifyCodeFunction={verifyInvitationCode} />
    }
  }

  return <div className="flex flex-col items-center justify-center min-h-dvh bg-white p-4">{renderStep()}</div>
}
