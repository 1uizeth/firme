"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReportSuspicionLayout from "@/components/report-suspicion/report-suspicion-layout"
import PlatformSelectionStep from "@/components/report-suspicion/platform-selection-step"
import DescriptionStep from "@/components/report-suspicion/description-step"
import ConfirmationStep from "@/components/report-suspicion/confirmation-step"
import SubmissionCompleteStep from "@/components/report-suspicion/submission-complete-step"
import { useReclaim } from "@/contexts/reclaim-context"
import { Button } from "@/components/ui/button" // For error state
import { AlertCircle } from "lucide-react" // For error state

const TOTAL_FORM_STEPS = 3 // Platforms, Description, Confirmation

export default function ReportSuspicionPage() {
  const router = useRouter()
  const { userProfile: monitoredUser, reportSuspicionByEmergencyContact, isLoading, error: contextError } = useReclaim()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  // Effect to redirect if no monitored user (e.g. direct navigation without context)
  useEffect(() => {
    if (!isLoading && !monitoredUser) {
      // Allow a brief moment for context to load
      setTimeout(() => {
        if (!monitoredUser) {
          console.warn("No monitored user found in context. Redirecting.")
          router.push("/contact-dashboard") // Or to an error page/homepage
        }
      }, 500)
    }
  }, [monitoredUser, isLoading, router])

  const reportInitiationTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handlePlatformsSelected = (platforms: string[]) => {
    setSelectedPlatforms(platforms)
    setCurrentStep(2) // Move to DescriptionStep
  }

  const handleDescriptionSubmitted = (desc: string) => {
    setDescription(desc)
    setCurrentStep(3) // Move to ConfirmationStep
  }

  const handleSubmitReport = async () => {
    if (!monitoredUser) {
      setFormError("Monitored user data is not available. Cannot submit report.")
      return
    }
    setFormError(null)
    // Assuming the emergency contact's name could be fetched or is known
    // For now, we can pass undefined or a generic name.
    await reportSuspicionByEmergencyContact(selectedPlatforms, description, "Emergency Contact")
    if (!contextError) {
      // Check if context had an error during submission
      setCurrentStep(4) // Move to SubmissionCompleteStep
    } else {
      setFormError(`Failed to submit report: ${contextError}. Please try again.`)
    }
  }

  const handleEditReport = () => {
    setCurrentStep(1) // Go back to the first step (Platform Selection)
  }

  const handleCancelReport = () => {
    router.push("/contact-dashboard")
  }

  if (isLoading && !monitoredUser) {
    return <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4">Loading...</div>
  }

  if (!monitoredUser) {
    // This state might be hit briefly before useEffect redirects, or if context fails to load user
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-neutral-700 mb-6">
          Could not load monitored user data. You may need to log in or select a user to monitor.
        </p>
        <Button onClick={() => router.push("/contact-dashboard")}>Go to Contact Dashboard</Button>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlatformSelectionStep
            onPlatformsSelected={handlePlatformsSelected}
            initialSelectedPlatforms={selectedPlatforms}
          />
        )
      case 2:
        return <DescriptionStep onDescriptionSubmitted={handleDescriptionSubmitted} initialDescription={description} />
      case 3:
        return (
          <ConfirmationStep
            monitoredUserName={monitoredUser.name}
            selectedPlatforms={selectedPlatforms}
            description={description}
            onSubmit={handleSubmitReport}
            onEdit={handleEditReport}
            onCancel={handleCancelReport}
            isLoading={isLoading}
          />
        )
      case 4:
        return <SubmissionCompleteStep monitoredUserName={monitoredUser.name} />
      default:
        return <p>Invalid step.</p>
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 sm:p-6">
      <ReportSuspicionLayout
        headerText={currentStep === 4 ? "Report Submitted" : "Report Suspicious Activity"}
        currentStep={currentStep <= TOTAL_FORM_STEPS ? currentStep : undefined}
        totalSteps={currentStep <= TOTAL_FORM_STEPS ? TOTAL_FORM_STEPS : undefined}
        contextText={currentStep <= TOTAL_FORM_STEPS ? `Reporting concerns for ${monitoredUser.name}` : undefined}
        timestamp={currentStep <= TOTAL_FORM_STEPS ? `Report initiated at ${reportInitiationTime}` : undefined}
      >
        {formError && (
          <p className="text-sm text-red-600 mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">
            {formError}
          </p>
        )}
        {renderStepContent()}
      </ReportSuspicionLayout>
    </div>
  )
}
