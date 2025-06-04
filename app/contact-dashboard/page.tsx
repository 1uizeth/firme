"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, ShieldAlert, ShieldQuestion, UserCheck, AlertCircle, LogOut, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Add this import
import { useReclaim } from "@/contexts/reclaim-context" // To get primary user's data for now
import { formatDisplayTimestamp } from "@/lib/reclaim-types"
import type { UserProfile, ActivityLogEntry } from "@/lib/reclaim-types"

// Mock: In a real app, this would be determined by the authenticated emergency contact's association
const MONITORED_USER_ID = "user_sarah_chen_123" // Assuming we monitor Sarah Chen from demo data

// Helper to get status display properties
const getStatusProps = (status: UserProfile["currentStatus"]) => {
  switch (status) {
    case "safe":
      return {
        text: "Safe",
        Icon: ShieldCheck,
        color: "text-[#00A86B]",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "No security concerns have been detected for this user.",
      }
    case "compromised":
      return {
        text: "Compromised",
        Icon: ShieldAlert,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "A security breach has been confirmed. The user's identity may be at risk.",
      }
    case "under_review": // New case
      return {
        text: "Under Review",
        Icon: ShieldQuestion, // Or a different icon like Info
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        description: "A potential security concern has been reported and is currently under review.",
      }
    case "recovering":
      return {
        text: "Recovering",
        Icon: ShieldQuestion,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Identity recovery process is currently in progress.",
      }
    default: // Default to safe or an unknown state
      return {
        text: "Unknown",
        Icon: ShieldQuestion,
        color: "text-neutral-600",
        bgColor: "bg-neutral-100",
        borderColor: "border-neutral-300",
        description: "The user's current security status is unknown.",
      }
  }
}

export default function ContactDashboardPage() {
  // For now, we use the main user's profile from context as the "monitored user"
  // In a real app, this would be fetched based on the logged-in emergency contact's association
  const { userProfile: monitoredUser, activityLog, isLoading, error } = useReclaim()
  const router = useRouter() // Initialize useRouter

  // Filter activity log for the monitored user (important if context could hold multiple users' logs)
  // And take top 5
  const relevantActivityLog = (activityLog || []).filter((entry) => entry.userId === monitoredUser?.userId).slice(0, 5)

  const handleReportSuspiciousActivity = () => {
    router.push("/report-suspicion")
  }

  const handleVerifyIdentityRequest = () => {
    alert(
      `Navigating to identity verification for ${
        monitoredUser?.name || "the user"
      }. You may be asked to confirm details or participate in a video call.`,
    )
    // router.push(`/contact-actions/verify-identity?userId=${monitoredUser?.userId}`);
  }

  const handleReportAdditionalConcerns = () => {
    const report = prompt(
      `Describe any additional concerns regarding the current situation for ${monitoredUser?.name || "the user"}:`,
    )
    if (report) {
      alert(`Additional concerns submitted: "${report}". This will be added to the case.`)
      // API call to add this to the ongoing incident
    }
  }

  if (isLoading && !monitoredUser) {
    return <div className="min-h-dvh flex items-center justify-center text-neutral-600">Loading dashboard...</div>
  }

  if (error || !monitoredUser) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-red-500 p-4">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold mb-2">Could not load user data.</p>
        <p className="text-center mb-6">{error || "The user you are trying to monitor could not be found."}</p>
        <Link href="/" passHref legacyBehavior>
          <Button asChild variant="outline">
            <a>Go to Homepage</a>
          </Button>
        </Link>
      </div>
    )
  }

  const statusProps = getStatusProps(monitoredUser.currentStatus)

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Minimal Top Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-black tracking-tight">
            Reclaim
          </Link>
          <div className="flex items-center space-x-3">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${statusProps.bgColor} ${statusProps.color}`}
            >
              Monitoring: {statusProps.text}
            </span>
            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black">
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-4 sm:px-6 py-8 md:py-12">
        <div className="space-y-10">
          {/* Monitored User Header */}
          <section className="text-center">
            <statusProps.Icon className={`w-16 h-16 mx-auto mb-3 ${statusProps.color}`} strokeWidth={1.5} />
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-1">{monitoredUser.name}</h1>
            <p className={`text-xl font-semibold mb-2 ${statusProps.color}`}>{statusProps.text}</p>
            <p className="text-sm text-neutral-500 mb-1">Your Role: Emergency Contact</p>
            <p className="font-mono text-xs text-neutral-500">
              Last System Check: {formatDisplayTimestamp(monitoredUser.lastVerification)}
            </p>
            {monitoredUser.currentStatus === "under_review" && monitoredUser.reviewRequestDetails && (
              <p className="text-xs text-yellow-700 mt-1 bg-yellow-100 px-2 py-1 rounded-md inline-block">
                Review initiated by: {monitoredUser.reviewRequestDetails.reportingContactName} at{" "}
                {formatDisplayTimestamp(monitoredUser.reviewRequestDetails.timestamp)}
                <br />
                Platforms: {monitoredUser.reviewRequestDetails.reportedPlatforms.join(", ")}
              </p>
            )}
          </section>

          <Separator className="bg-neutral-200" />

          {/* Status Card */}
          <section>
            <div
              className={`p-6 rounded-lg border ${statusProps.borderColor} ${statusProps.bgColor} text-center shadow-sm`}
            >
              <h2 className="text-xl font-semibold mb-2 ${statusProps.color} flex items-center justify-center">
                <statusProps.Icon className={`w-6 h-6 mr-2`} />
                Current Status
              </h2>
              <p
                className={`text-md ${statusProps.color === "text-neutral-600" ? "text-neutral-700" : statusProps.color}`}
              >
                {statusProps.description}
              </p>
            </div>
          </section>

          <Separator className="bg-neutral-200" />

          {/* Action Section */}
          <section className="text-center">
            <h2 className="text-xl font-semibold text-black mb-4">Actions</h2>
            {monitoredUser.currentStatus === "compromised" || monitoredUser.currentStatus === "recovering" ? (
              <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
                <Button
                  size="lg"
                  onClick={handleVerifyIdentityRequest}
                  className="w-full sm:w-auto bg-[#00A86B] hover:bg-[#008F5B] text-white px-6 py-3 text-base rounded-md"
                >
                  <UserCheck className="w-5 h-5 mr-2" /> Verify Identity Request
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReportAdditionalConcerns}
                  className="w-full sm:w-auto border-neutral-400 text-neutral-700 hover:bg-neutral-100 px-6 py-3 text-base rounded-md"
                >
                  <Eye className="w-5 h-5 mr-2" /> Report Additional Concerns
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  size="lg"
                  onClick={handleReportSuspiciousActivity}
                  className="bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 py-3 text-base rounded-md"
                >
                  Report Suspicious Activity
                </Button>
                <p className="text-xs text-neutral-500 mt-2">Flag potential security issues you observe.</p>
              </div>
            )}
          </section>

          <Separator className="bg-neutral-200" />

          {/* Security Activity Log */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-4">Recent Security Events</h2>
            {relevantActivityLog.length > 0 ? (
              <ul className="space-y-3 bg-white p-4 sm:p-6 rounded-lg border border-neutral-200 shadow-sm">
                {relevantActivityLog.map((event: ActivityLogEntry) => (
                  <li
                    key={event.activityId}
                    className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-neutral-100 last:border-b-0"
                  >
                    <span className="text-sm text-neutral-700 mb-1 sm:mb-0">
                      {event.eventType.replace(/_/g, " ")}
                      {event.details?.name && `: ${event.details.name}`}
                      {event.details?.contactName && `: ${event.details.contactName}`}
                      {event.details?.source &&
                        !event.details.name &&
                        !event.details.contactName &&
                        `: ${event.details.source}`}
                      {event.details?.reason && `: "${event.details.reason}"`}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 self-start sm:self-center">
                      {formatDisplayTimestamp(event.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
                <p className="text-neutral-500">No recent security events logged for this user.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="font-mono text-xs text-neutral-400">
          Reclaim Emergency Contact Portal &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
