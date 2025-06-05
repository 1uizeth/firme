"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2, ShieldEllipsis } from "lucide-react"

import RecoveryLayout from "@/components/recovery-process/recovery-layout"
import RecoveryTimelineDisplay from "@/components/recovery-process/recovery-timeline-display"
import ContactAlertStatusDisplay from "@/components/recovery-process/contact-alert-status-display"
import RecoveryMessageComposer from "@/components/recovery-process/recovery-message-composer"
import RecoveryActions from "@/components/recovery-process/recovery-actions"
import RecoveryProgressTracker from "@/components/recovery-process/recovery-progress-tracker"
import AccountSecurityGuidance from "@/components/recovery-process/account-security-guidance"

export default function RecoveryProcessPage() {
  const router = useRouter()
  const {
    userProfile,
    contacts,
    notifications,
    isLoading: contextIsLoading,
    error: contextError,
    logActivity,
    sendRecoveryMessage,
    simulateContactRecoveryVotes, // For demo
    completeRecovery, // For demo to complete process
  } = useReclaim()

  useEffect(() => {
    if (!contextIsLoading && userProfile && userProfile.currentStatus !== "recovering") {
      // If not in recovery, or no profile, redirect.
      console.warn("User not in recovery state. Redirecting from /recovery-process.")
      router.push("/dashboard")
    } else if (userProfile && userProfile.currentStatus === "recovering") {
      logActivity("recovery_process_viewed", { stage: userProfile.recoveryStage || "initial" })
    }
  }, [userProfile, contextIsLoading, router, logActivity])

  const activeRecoveryNotifications = useMemo(() => {
    return notifications.filter(
      (n) => n.notificationType === "breach_alert" || n.notificationType === "recovery_update",
    )
  }, [notifications])

  const compromisedPlatforms = useMemo(() => {
    return userProfile?.breachTriggerDetails?.reportedPlatforms || ["Unknown Accounts"]
  }, [userProfile])

  if (contextIsLoading && !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#00A86B] mb-4" />
        <p className="text-neutral-600">Loading recovery process...</p>
      </div>
    )
  }

  if (contextError) {
    return (
      <RecoveryLayout headerText="Error">
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-semibold">An Error Occurred</p>
          <p className="text-red-600 text-sm mb-3">{contextError}</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </RecoveryLayout>
    )
  }

  if (!userProfile || userProfile.currentStatus !== "recovering") {
    return (
      <RecoveryLayout headerText="Recovery Not Active">
        <div className="text-center">
          <ShieldEllipsis className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-700 mb-6">
            The account recovery process is not currently active for your account.
          </p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </RecoveryLayout>
    )
  }

  return (
    <RecoveryLayout
      headerText="Account Recovery In Progress"
      userName={userProfile.name}
      currentStage={userProfile.recoveryStage || "Starting..."}
    >
      <div className="space-y-8 md:space-y-10">
        <RecoveryTimelineDisplay currentStage={userProfile.recoveryStage || "alerting_contacts"} />
        <Separator />
        <ContactAlertStatusDisplay
          contacts={contacts.filter((c) => c.status === "active")}
          notifications={activeRecoveryNotifications}
          userName={userProfile.name}
          compromisedPlatforms={compromisedPlatforms}
          lastVerifiedTimestamp={userProfile.lastVerification}
        />
        <Separator />
        <RecoveryMessageComposer
          compromisedPlatforms={compromisedPlatforms}
          onSendMessage={sendRecoveryMessage}
          isLoading={contextIsLoading}
        />
        <Separator />
        <RecoveryActions
          onContactSupport={() => alert("Contact Support: support@reclaim.id (Placeholder)")}
          // Add other actions if needed
        />
        <Separator />
        <RecoveryProgressTracker
          contacts={contacts.filter((c) => c.status === "active")}
          currentStage={userProfile.recoveryStage || "alerting_contacts"}
          onSimulateVotes={simulateContactRecoveryVotes} // Demo
          onCompleteRecovery={completeRecovery} // Demo
        />
        <Separator />
        <AccountSecurityGuidance onLogAction={(action) => logActivity("account_security_action_checked", { action })} />
      </div>
    </RecoveryLayout>
  )
}
