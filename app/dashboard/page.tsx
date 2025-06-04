"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { AlertTriangle, ShieldAlert, ShieldCheck, Users, ShieldEllipsis } from "lucide-react" // Added Users icon
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context"
import { formatDisplayTimestamp } from "@/lib/reclaim-types"

export default function DashboardPage() {
  const router = useRouter()
  const {
    userProfile,
    contacts,
    activityLog,
    isLoading: contextIsLoading,
    error: contextError,
    simulateBreachByContactFlag,
    updateUserProfile,
    resetSessionData,
  } = useReclaim()

  const displayedActivityLog = activityLog.slice(0, 5)

  const handleManualVerificationAndSimulateBreach = async () => {
    if (userProfile && contacts.filter((c) => c.status === "active").length > 0) {
      const now = new Date().toISOString()
      await updateUserProfile({ lastVerification: now })
      await simulateBreachByContactFlag() // This will set status to compromised via flagSuspicionByContact
      router.push("/breach-alert")
    } else if (userProfile && contacts.filter((c) => c.status === "active").length === 0) {
      alert("Please add and activate at least one emergency contact before simulating a breach.")
    } else {
      console.error("User profile not available or no active contacts to run manual verification.")
    }
  }

  if (contextIsLoading) {
    return <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 text-center">Loading dashboard...</div>
  }

  if (contextError && contextError.includes("Cannot simulate breach")) {
    // Handled by button state/alert
  } else if (contextError) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 text-center text-red-500">
        Error loading dashboard: {contextError}
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 text-center">
        User profile not loaded. Please try again.
      </div>
    )
  }

  const isCompromised = userProfile.currentStatus === "compromised"
  const isUnderReview = userProfile.currentStatus === "under_review"
  const isRecovering = userProfile.currentStatus === "recovering"

  let statusTextColor = "text-[#00A86B]"
  let StatusIcon = ShieldCheck
  let statusText = "System Secure"
  let actionButton = null

  if (isCompromised) {
    statusTextColor = "text-red-600"
    StatusIcon = ShieldAlert
    statusText = "Compromise Detected"
    actionButton = (
      <Button
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base rounded-md"
        onClick={() => router.push("/security-review")} // Changed to /security-review
      >
        <AlertTriangle className="mr-2 h-5 w-5" /> Review Breach Alert
      </Button>
    )
  } else if (isUnderReview) {
    statusTextColor = "text-yellow-600"
    StatusIcon = ShieldAlert // Or a specific review icon
    statusText = "Security Review Pending"
    actionButton = (
      <Button
        size="lg"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-base rounded-md"
        onClick={() => router.push("/security-review")}
      >
        <AlertTriangle className="mr-2 h-5 w-5" /> Review Security Alert
      </Button>
    )
  } else if (isRecovering) {
    statusTextColor = "text-blue-600"
    StatusIcon = ShieldEllipsis // Using ShieldEllipsis for recovering
    statusText = "Recovery In Progress"
    actionButton = (
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-md"
        onClick={() => router.push("/recovery-process")}
      >
        <ShieldEllipsis className="mr-2 h-5 w-5" /> Continue Recovery
      </Button>
    )
  }

  const actionRequired = isCompromised || isUnderReview || isRecovering
  const canSimulateBreach = contacts.filter((c) => c.status === "active").length > 0

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="space-y-10 md:space-y-12">
        {/* Status Section */}
        <section aria-labelledby="status-heading">
          <div className="flex flex-col items-center text-center">
            <StatusIcon className={`w-16 h-16 mb-3 ${statusTextColor}`} strokeWidth={1.5} />
            <h1 id="status-heading" className={`text-4xl md:text-5xl font-bold ${statusTextColor} mb-2`}>
              {statusText}
            </h1>
            <p className="text-neutral-600 text-sm mb-1">Current Status for {userProfile.name}</p>
            <p className="font-mono text-xs text-neutral-500 mb-6">
              Last verification: {formatDisplayTimestamp(userProfile.lastVerification)}
            </p>
            {isCompromised && userProfile.breachTriggerDetails && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                <p className="font-semibold">
                  Triggered by: {userProfile.breachTriggerDetails.contactName || "System"}
                </p>
                {userProfile.breachTriggerDetails.reason && (
                  <p className="italic">Reason: "{userProfile.breachTriggerDetails.reason}"</p>
                )}
                <p>At: {formatDisplayTimestamp(userProfile.breachTriggerDetails.timestamp)}</p>
              </div>
            )}
            {isUnderReview && userProfile.reviewRequestDetails && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                <p className="font-semibold">
                  Review requested by: {userProfile.reviewRequestDetails.reportingContactName || "System"}
                </p>
                {userProfile.reviewRequestDetails.reportDescription && (
                  <p className="italic">Details: "{userProfile.reviewRequestDetails.reportDescription}"</p>
                )}
                <p>Platforms: {userProfile.reviewRequestDetails.reportedPlatforms.join(", ")}</p>
                <p>At: {formatDisplayTimestamp(userProfile.reviewRequestDetails.timestamp)}</p>
              </div>
            )}
            {actionButton}
            {!actionRequired && ( // Show simulate breach button only if no other action is required
              <Button
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-6 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleManualVerificationAndSimulateBreach}
                disabled={!canSimulateBreach}
                title={
                  !canSimulateBreach
                    ? "Add & activate emergency contacts to enable breach simulation"
                    : "Run verification and simulate a breach"
                }
              >
                Run Manual Verification & Simulate Breach
              </Button>
            )}
            {!actionRequired && !canSimulateBreach && (
              <p className="text-xs text-neutral-500 mt-2">
                Add & activate at least one emergency contact to enable breach simulation.
              </p>
            )}
          </div>
        </section>

        <Separator className="bg-neutral-200" />

        {/* Monitoring Section */}
        <section aria-labelledby="monitoring-heading">
          <h2 id="monitoring-heading" className="text-xl font-semibold text-black mb-4">
            System Activity
          </h2>
          {displayedActivityLog.length > 0 ? (
            <ul className="space-y-3">
              {displayedActivityLog.map((item) => (
                <li
                  key={item.activityId}
                  className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="text-sm text-neutral-800 mb-1 sm:mb-0">
                    {item.eventType.replace(/_/g, " ")}:{" "}
                    {item.details?.name ||
                      item.details?.contactName ||
                      item.details?.source ||
                      item.details?.reason ||
                      item.details?.reportedPlatforms?.join(", ") ||
                      ""}
                  </span>
                  <span className="font-mono text-xs text-neutral-500 self-start sm:self-center">
                    {formatDisplayTimestamp(item.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">No recent system activity.</p>
          )}
        </section>

        <Separator className="bg-neutral-200" />

        {/* Contacts Section - Updated */}
        <section aria-labelledby="contacts-heading">
          <div className="flex justify-between items-center mb-3">
            <h2 id="contacts-heading" className="text-xl font-semibold text-black">
              Emergency Network
            </h2>
            <Link href="/manage-contacts" passHref legacyBehavior>
              <Button
                asChild
                variant="outline"
                className="border-neutral-300 text-[#00A86B] hover:border-[#00A86B] hover:bg-[#00A86B]/10 px-4 py-1.5 text-sm rounded-md"
              >
                <a>Manage Contacts</a>
              </Button>
            </Link>
          </div>
          <p className="text-sm text-neutral-700">
            <Users className="inline h-4 w-4 mr-1.5 text-neutral-500" />
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""} configured (
            {contacts.filter((c) => c.status === "active").length} active,{" "}
            {contacts.filter((c) => c.status === "pending_invitation").length} pending)
          </p>
        </section>

        <Separator className="bg-neutral-200" />
        <footer className="text-center py-4">
          <p className="font-mono text-xs text-neutral-400">
            Reclaim Secure Dashboard &copy; {new Date().getFullYear()}
          </p>
          {/* Temporary Reset Button for Development */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all session data? This is for testing purposes.")) {
                resetSessionData()
              }
            }}
            className="mt-4"
          >
            Reset Session Data (Dev)
          </Button>
        </footer>
      </div>
    </div>
  )
}
