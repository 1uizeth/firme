"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context"
import SecurityReviewLayout from "@/components/security-review/security-review-layout"
import OverviewStep from "@/components/security-review/overview-step"
import IdentityVerificationStep from "@/components/security-review/identity-verification-step"
import CompromiseConfirmedScreen from "@/components/security-review/compromise-confirmed-screen"
import FalseAlarmScreen from "@/components/security-review/false-alarm-screen"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const TOTAL_STEPS_FOR_COMPROMISE = 3 // Overview -> Verify -> Confirm Compromise
const TOTAL_STEPS_FOR_FALSE_ALARM = 2 // Overview -> Confirm False Alarm

// Add this helper component definition at the top of the file or import if it's shared
function Loader2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function SecurityReviewPage() {
  const router = useRouter()
  const {
    userProfile,
    isLoading: contextIsLoading,
    contextError,
    initiateSecurityReview,
    confirmCompromiseAfterReview,
    dismissAsFalseAlarm,
    logActivity, // For identity verification step
  } = useReclaim()

  const [currentStep, setCurrentStep] = useState(1) // 1: Overview, 2: Verify (if needed), 3: Confirmation
  const [flowError, setFlowError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasInitiatedReview, setHasInitiatedReview] = useState(false)

  useEffect(() => {
    if (contextIsLoading) {
      return // Wait for context to load, the loading UI below will be shown
    }

    // If, after loading, the conditions are still not met, redirect.
    if (!userProfile || userProfile.currentStatus !== "under_review" || !userProfile.reviewRequestDetails) {
      console.warn(
        "SecurityReviewPage: User not 'under_review' or profile/reviewDetails missing after context load. Redirecting to dashboard.",
      )
      router.push("/dashboard")
      return
    }

    // If user is under review and we haven't initiated the log yet for this page view
    if (currentStep === 1 && !hasInitiatedReview) {
      initiateSecurityReview()
      setHasInitiatedReview(true)
    }
  }, [userProfile, contextIsLoading, router, initiateSecurityReview, currentStep, hasInitiatedReview])

  const handleConfirmCompromise = async () => {
    setIsSubmitting(true)
    setFlowError(null)
    try {
      if (!userProfile || !userProfile.reviewRequestDetails) {
        throw new Error("User profile or review details not found")
      }
      // Confirm the compromise with proper breach details
      await confirmCompromiseAfterReview(
        userProfile.reviewRequestDetails.isPhoneIssue,
        userProfile.reviewRequestDetails.phoneIssueType,
      )
      // After confirming compromise, redirect to breach alert page
      router.push("/breach-alert")
    } catch (err) {
      setFlowError("Failed to confirm compromise. Please try again.")
      console.error("Error confirming compromise:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFalseAlarmPath = async (messageToContact?: string) => {
    setFlowError(null)
    setIsSubmitting(true)
    try {
      await dismissAsFalseAlarm(messageToContact)
      setCurrentStep(TOTAL_STEPS_FOR_FALSE_ALARM + 1) // Move to False Alarm Confirmation Screen (step 3 effectively)
    } catch (e: any) {
      setFlowError(e.message || "Failed to dismiss as false alarm.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSuccess = async () => {
    setFlowError(null)
    setIsSubmitting(true)
    try {
      // Identity verification success is logged by the component,
      // now call the context function to finalize compromise confirmation
      await confirmCompromiseAfterReview()
      setCurrentStep(TOTAL_STEPS_FOR_COMPROMISE + 1) // Move to Compromise Confirmed Screen (step 4 effectively)
    } catch (e: any) {
      setFlowError(e.message || "Failed to confirm compromise after verification.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationFailure = (errMessage: string) => {
    setFlowError(`Identity verification failed: ${errMessage}. Please try again.`)
  }

  if (contextIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4">
        <Loader2Icon className="h-12 w-12 animate-spin text-[#00A86B] mb-4" />
        <p className="text-neutral-600">Loading security review data...</p>
      </div>
    )
  }

  if (!userProfile || userProfile.currentStatus !== "under_review" || !userProfile.reviewRequestDetails) {
    // This might show briefly before redirect or if context is slow/fails
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-neutral-700 mb-6">
          There is no active security review for your account, or your session is invalid.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  const { reviewRequestDetails, name: userName } = userProfile

  const renderStepContent = () => {
    if (flowError) {
      return (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-semibold">An Error Occurred</p>
          <p className="text-red-600 text-sm mb-3">{flowError}</p>
          <Button
            onClick={() => {
              setFlowError(null)
              setCurrentStep(1)
            }}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )
    }

    switch (currentStep) {
      case 1: // Overview & Choice
        return (
          <OverviewStep
            reviewDetails={reviewRequestDetails}
            userName={userName}
            onConfirmCompromise={handleConfirmCompromise}
            onFalseAlarm={handleFalseAlarmPath} // Pass the direct function
            isSubmitting={isSubmitting}
          />
        )
      case 2: // Identity Verification (only if compromise path chosen)
        return (
          <IdentityVerificationStep
            onVerificationSuccess={handleVerificationSuccess}
            onVerificationFailure={handleVerificationFailure}
            userName={userName}
            logActivity={logActivity} // Pass logActivity for internal logging of verification attempt
            isSubmitting={isSubmitting}
          />
        )
      case TOTAL_STEPS_FOR_FALSE_ALARM + 1: // False Alarm Confirmation (e.g. step 3 if overview is 1, false alarm is 2)
        return (
          <FalseAlarmScreen
            userName={userName}
            reportingContactName={reviewRequestDetails.reportingContactName || "The reporting contact"}
          />
        )
      case TOTAL_STEPS_FOR_COMPROMISE + 1: // Compromise Confirmed Screen (e.g. step 4 if overview 1, verify 2, confirm 3)
        return (
          <CompromiseConfirmedScreen userName={userName} reportedPlatforms={reviewRequestDetails.reportedPlatforms} />
        )
      default:
        return <p>Invalid step in security review.</p>
    }
  }

  let headerText = "Security Review"
  if (currentStep === TOTAL_STEPS_FOR_FALSE_ALARM + 1) headerText = "Review Dismissed"
  if (currentStep === TOTAL_STEPS_FOR_COMPROMISE + 1) headerText = "Compromise Confirmed"

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 sm:p-6">
      <SecurityReviewLayout
        headerText={headerText}
        contextText={currentStep === 1 ? `Responding to alert for ${userName}` : undefined}
      >
        {renderStepContent()}
      </SecurityReviewLayout>
    </div>
  )
}
