"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Video, RefreshCw, Check, AlertCircle } from "lucide-react"
import type { EventType } from "@/lib/reclaim-types" // For logActivity

interface IdentityVerificationStepProps {
  userName: string
  onVerificationSuccess: () => void
  onVerificationFailure: (errorMessage: string) => void
  logActivity: (eventType: EventType, details: Record<string, any>, systemSource?: string) => Promise<void>
  isSubmitting: boolean
}

// In a real app, this would be securely generated per session
const generatedPassphrase = "azure-phoenix-citadel-echo-stream"

export default function IdentityVerificationStep({
  userName,
  onVerificationSuccess,
  onVerificationFailure,
  logActivity,
  isSubmitting,
}: IdentityVerificationStepProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRecord = async () => {
    setError(null)
    setIsRecording(true)
    // Simulate recording process
    await new Promise((resolve) => setTimeout(resolve, 2500)) // Simulate 2.5s recording

    // Simulate random success/failure for demo
    const success = Math.random() > 0.2 // 80% chance of success
    setIsRecording(false)

    if (success) {
      setHasRecorded(true)
      // logActivity("security_review_identity_verified", { method: "video_passphrase_simulation" }, "UserAction")
      // The actual logging of "security_review_identity_verified" will be done in the context
      // when confirmCompromiseAfterReview is called, after this step.
    } else {
      const failReason = "Simulated recording error: Could not access camera."
      setError(failReason)
      setHasRecorded(false)
      // No need to call onVerificationFailure here yet, user can retry.
      // onVerificationFailure would be called if they try to proceed with a failed recording,
      // but this component structure makes them re-record.
    }
  }

  const handleRetake = () => {
    setHasRecorded(false)
    setError(null)
  }

  const handleProceed = () => {
    if (hasRecorded) {
      onVerificationSuccess()
    } else {
      setError("Please record your verification video first.")
      // This shouldn't be reachable if button is disabled, but as a fallback.
    }
  }

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-black">Verify Your Identity</h2>
      <p className="text-neutral-600">
        To confirm this is really you, {userName}, please record a short video reciting the passphrase below.
      </p>

      <div className="w-full h-56 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center mb-5">
        {isRecording ? (
          <>
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-2" />
            <p className="text-red-500 text-sm">Recording...</p>
          </>
        ) : hasRecorded ? (
          <>
            <Check className="w-16 h-16 text-green-500 mb-2" />
            <p className="text-green-600 text-sm">Verification Recorded</p>
          </>
        ) : (
          <>
            <Video className="w-16 h-16 text-neutral-400 mb-2" />
            <p className="text-neutral-500 text-sm">Live Video Recording Area</p>
          </>
        )}
      </div>

      <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
        <p className="font-mono text-black text-center text-lg tracking-wider">{generatedPassphrase}</p>
        <p className="text-xs text-neutral-500 text-center mt-1">Recite this passphrase clearly during recording.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <AlertCircle className="inline w-4 h-4 mr-1" /> {error}
        </div>
      )}

      {!hasRecorded ? (
        <Button
          onClick={handleRecord}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg rounded-md"
          disabled={isRecording || isSubmitting}
        >
          {isRecording ? (
            <>
              {" "}
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recording...{" "}
            </>
          ) : (
            <>
              {" "}
              <Video className="mr-2 h-5 w-5" /> Record Verification{" "}
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
          <Button
            onClick={handleRetake}
            variant="outline"
            className="w-full sm:w-auto border-neutral-400"
            disabled={isRecording || isSubmitting}
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Retake Video
          </Button>
          <Button
            onClick={handleProceed}
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-md"
            disabled={isRecording || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm & Proceed"
            )}
          </Button>
        </div>
      )}
      <p className="text-xs text-neutral-500 mt-4">
        Your video is processed in a secure TEE environment and deleted after verification.
      </p>
    </div>
  )
}
// Simple Loader2 component for demo
function Loader2(props: React.SVGProps<SVGSVGElement>) {
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
