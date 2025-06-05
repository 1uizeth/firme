"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Video, ShieldAlert, UserCheck } from "lucide-react" // Icons
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context" // Import useReclaim
import { useEffect } from "react"
import { formatDisplayTimestamp } from "@/lib/utils" // Use consistent formatter

// Mock data - these could eventually come from the breach details or user settings
const generatedPassphrase = "crimson-sentinel-vector-omega-void"
// UPDATED: Only WhatsApp is listed as compromised
const compromisedAccountsList = ["WhatsApp"]

export default function BreachAlertPage() {
  const router = useRouter()
  const { userProfile, isLoading, error, initiateRecovery, sendAlertsToContacts, logActivity } = useReclaim()

  // Redirect if not compromised or no trigger details
  useEffect(() => {
    if (!isLoading && userProfile && userProfile.currentStatus !== "compromised") {
      console.log("User not compromised or no trigger details, redirecting to dashboard.")
      router.push("/dashboard")
    }
  }, [userProfile, isLoading, router])

  const handleRecordVerification = async () => {
    alert("Simulating video recording process for verification...")
    // In a real app, this would trigger the camera and recording logic.
    // After successful recording, it might enable further actions or move to a new state.
    if (userProfile) {
      await logActivity("identity_reverified", { method: "breach_response_video_simulation" })
      // Potentially update userProfile state here if verification unlocks actions
    }
  }

  const handleAlertContacts = async () => {
    if (userProfile) {
      // Use the updated compromisedAccountsList which now only contains "WhatsApp"
      await sendAlertsToContacts(compromisedAccountsList)
      router.push("/alerting-network")
    }
  }

  const handleBeginRecovery = async () => {
    await initiateRecovery()
    alert("Recovery process initiated. You might be guided through further steps.")
    // Potentially navigate to a recovery status page or first step of recovery
    router.push("/dashboard") // Or a dedicated recovery status page
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
        <p>Loading breach information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center text-red-600">
        <p>Error: {error}</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  if (!userProfile || userProfile.currentStatus !== "compromised" || !userProfile.breachTriggerDetails) {
    // This case should ideally be caught by the useEffect redirect, but good as a fallback.
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
        <p>No active breach alert found or user not compromised.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  const { breachTriggerDetails } = userProfile
  const detectionSourceText =
    breachTriggerDetails.type === "contact_flag" && breachTriggerDetails.contactName
      ? `Flagged by: ${breachTriggerDetails.contactName}`
      : "System Oracles & Breach Monitors" // Fallback if type is different

  const detectionTimestamp = breachTriggerDetails.timestamp

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="space-y-10 md:space-y-12">
        {/* Alert Status Section */}
        <section aria-labelledby="alert-status-heading" className="text-center">
          <ShieldAlert className="w-20 h-20 text-red-600 mx-auto mb-4" strokeWidth={1.5} />
          <h1 id="alert-status-heading" className="text-5xl md:text-6xl font-bold text-red-600 mb-3">
            Compromise Detected
          </h1>
          <p className="text-base text-neutral-700 mb-1">
            Detection Source: <span className="font-semibold">{detectionSourceText}</span>
          </p>
          {breachTriggerDetails.type === "contact_flag" && breachTriggerDetails.reason && (
            <p className="text-sm text-neutral-600 mb-1 italic">Reason: "{breachTriggerDetails.reason}"</p>
          )}
          <p className="font-mono text-sm text-neutral-500">Detected: {formatDisplayTimestamp(detectionTimestamp)}</p>
        </section>

        <Separator className="bg-neutral-300" />

        {/* Verification Section */}
        <section aria-labelledby="verification-heading">
          <h2 id="verification-heading" className="text-2xl font-semibold text-black mb-3 text-center">
            Identity Verification Required
          </h2>
          <p className="text-neutral-700 mb-6 text-center text-md">
            Record live verification to proceed with recovery actions.
          </p>

          <div className="w-full h-56 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center mb-5">
            <Video className="w-16 h-16 text-neutral-400 mb-2" />
            <p className="text-neutral-500 text-sm">Live Video Recording Area</p>
          </div>

          <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
            <p className="font-mono text-black text-center text-lg tracking-wider">{generatedPassphrase}</p>
            <p className="text-xs text-neutral-500 text-center mt-1">Recite this passphrase during recording.</p>
          </div>

          <Button
            onClick={handleRecordVerification}
            className="w-full bg-neutral-800 hover:bg-black text-white py-3 text-lg rounded-md"
            aria-label="Record identity verification video"
          >
            <UserCheck className="mr-2 h-5 w-5" /> Record Verification
          </Button>
        </section>

        <Separator className="bg-neutral-300" />

        {/* Affected Accounts Section (Now only WhatsApp) */}
        <section aria-labelledby="affected-accounts-heading">
          <h2 id="affected-accounts-heading" className="text-2xl font-semibold text-black mb-4 text-center">
            Potentially Compromised Account
          </h2>
          {compromisedAccountsList.length > 0 ? (
            <ul className="space-y-2 text-center">
              {compromisedAccountsList.map((account, index) => (
                <li key={index} className="text-md text-neutral-700 py-1">
                  {account}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-md text-neutral-500 text-center">No specific accounts identified yet.</p>
          )}
        </section>

        <Separator className="bg-neutral-300" />

        {/* Response Section */}
        <section aria-labelledby="response-heading" className="text-center">
          <h2 id="response-heading" className="sr-only">
            Response Actions
          </h2>
          <div className="space-y-4 md:space-y-0 md:flex md:flex-row-reverse md:justify-center md:space-x-4 md:space-x-reverse">
            <Button
              onClick={handleAlertContacts}
              size="lg"
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-3 text-lg rounded-md"
              aria-label="Alert emergency contacts about the breach"
              disabled={isLoading}
            >
              <AlertTriangle className="mr-2 h-5 w-5" /> Alert Contacts
            </Button>
            <Button
              onClick={handleBeginRecovery}
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-red-600 text-red-600 hover:bg-red-600/10 hover:text-red-700 px-10 py-3 text-lg rounded-md"
              aria-label="Begin account recovery process"
              disabled={isLoading}
            >
              Begin Recovery
            </Button>
          </div>
        </section>
        <Separator className="bg-neutral-300" />
        <footer className="text-center py-4">
          <p className="font-mono text-xs text-neutral-400">Reclaim Security System</p>
        </footer>
      </div>
    </div>
  )
}
