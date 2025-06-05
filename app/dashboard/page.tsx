"use client"

import type React from "react"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  MessageSquareWarning,
  PhoneOff,
  UserCheck,
  ListChecks,
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  Search,
  Shield,
} from "lucide-react"
import { formatDisplayTimestamp, formatShortTimestamp } from "@/lib/utils" // This import should now work correctly
import { type ActivityLogEntry, EventType, type UserProfile as UserProfileType } from "@/lib/reclaim-types"
import Link from "next/link"

const getStatusIcon = (status: UserProfileType["currentStatus"], isPhoneIssue?: boolean): React.ReactNode => {
  if (isPhoneIssue) {
    switch (status) {
      case "safe":
        return <Smartphone className="h-6 w-6 text-green-500" />
      case "under_review":
        return <MessageSquareWarning className="h-6 w-6 text-yellow-500" />
      case "compromised":
      case "recovering":
        return <PhoneOff className="h-6 w-6 text-red-500" />
      default:
        return <Smartphone className="h-6 w-6 text-gray-500" />
    }
  }
  switch (status) {
    case "safe":
      return <ShieldCheck className="h-6 w-6 text-green-500" />
    case "under_review":
      return <ShieldAlert className="h-6 w-6 text-yellow-500" />
    case "compromised":
    case "recovering":
      return <AlertTriangle className="h-6 w-6 text-red-500" />
    default:
      return <ShieldCheck className="h-6 w-6 text-gray-500" />
  }
}

const getStatusInfo = (
  userProfile: UserProfileType | null,
): { title: string; description: string; action?: React.ReactNode; isPhoneIssue?: boolean } => {
  if (!userProfile) return { title: "Loading...", description: "Please wait." }

  const isPhoneBreach =
    userProfile.breachTriggerDetails?.isPhoneIssue || userProfile.reviewRequestDetails?.isPhoneIssue || false
  // const phoneIssueType =
  //   userProfile.breachTriggerDetails?.phoneIssueType || userProfile.reviewRequestDetails?.phoneIssueType

  switch (userProfile.currentStatus) {
    case "safe":
      return {
        title: isPhoneBreach || userProfile.phoneNumber ? "Phone Secure" : "Account Secure",
        description:
          isPhoneBreach || userProfile.phoneNumber
            ? "Your phone number is protected."
            : "Your account is currently secure.",
        isPhoneIssue: isPhoneBreach || !!userProfile.phoneNumber,
      }
    case "under_review":
      const reviewDetails = userProfile.reviewRequestDetails
      const reportedBy = reviewDetails?.reportingContactName || "System"
      const issue = reviewDetails?.isPhoneIssue
        ? reviewDetails.phoneIssueType || "phone security concern"
        : reviewDetails?.reportedPlatforms.join(", ") || "general security concern"
      const reviewTimestamp = reviewDetails?.timestamp ? formatShortTimestamp(reviewDetails.timestamp) : "N/A"
      return {
        title: reviewDetails?.isPhoneIssue ? "Phone Security Review" : "Security Review Pending",
        description: `${reportedBy} reported a potential ${issue} at ${reviewTimestamp}.`,
        action: (
          <Link href="/security-review">
            <Button>Review {reviewDetails?.isPhoneIssue ? "Phone " : ""}Alert</Button>
          </Link>
        ),
        isPhoneIssue: reviewDetails?.isPhoneIssue,
      }
    case "compromised":
      const breachDetails = userProfile.breachTriggerDetails
      const compromiseTimestamp = breachDetails?.timestamp ? formatShortTimestamp(breachDetails.timestamp) : "N/A"
      const compromiseReason = breachDetails?.isPhoneIssue
        ? `Phone compromise confirmed: ${breachDetails.phoneIssueType || "details unavailable"}`
        : breachDetails?.reason || "Unknown reason"
      return {
        title: breachDetails?.isPhoneIssue ? "Phone Compromised" : "Account Compromised",
        description: `${compromiseReason}. Breach confirmed at ${compromiseTimestamp}.`,
        action: (
          <Link href="/recovery-process">
            <Button variant="destructive">Begin {breachDetails?.isPhoneIssue ? "Phone " : ""}Recovery</Button>
          </Link>
        ),
        isPhoneIssue: breachDetails?.isPhoneIssue,
      }
    case "recovering":
      return {
        title: userProfile.breachTriggerDetails?.isPhoneIssue
          ? "Phone Recovery In Progress"
          : "Account Recovery In Progress",
        description: "We are working to restore full security to your account.",
        action: (
          <Link href="/recovery-process">
            <Button>View Recovery Status</Button>
          </Link>
        ),
        isPhoneIssue: userProfile.breachTriggerDetails?.isPhoneIssue,
      }
    case "recovered":
      return {
        title: userProfile.breachTriggerDetails?.isPhoneIssue ? "Phone Security Restored" : "Account Security Restored",
        description: "Your account security has been successfully restored.",
        isPhoneIssue: userProfile.breachTriggerDetails?.isPhoneIssue,
      }
    default:
      return { title: "Unknown Status", description: "Please contact support." }
  }
}

const formatActivityDetails = (entry: ActivityLogEntry): string => {
  const details = entry.details
  switch (entry.eventType) {
    case EventType.PHONE_NUMBER_VERIFIED:
      return `Number: ${details.phoneNumber}`
    case EventType.PHONE_SECURITY_CHECK_COMPLETED:
      return `Result: ${details.result || "OK"}`
    case EventType.PHONE_SECURITY_ISSUE_REPORTED_BY_CONTACT:
      return `Reported by: ${details.contactName || "Contact"}. Issue: ${details.phoneIssueType || details.platform || "Unknown"}`
    case EventType.PHONE_COMPROMISE_CONFIRMED:
      return `Reason: ${details.reason || "Confirmed by user"}. Issue: ${details.phoneIssueType || "General"}`
    case EventType.PHONE_RECOVERY_INITIATED:
      return `Recovery for phone started. Stage: ${details.stage || "Initial"}`
    case EventType.PHONE_SECURITY_RESTORED:
      return `Phone security fully restored.`
    case EventType.CONTACT_FLAGGED_SUSPICION:
    case EventType.SUSPICION_REPORTED_BY_CONTACT:
      return `Platform: ${details.platform}. Reported by: ${details.contactName || "User"}.`
    case EventType.COMPROMISE_CONFIRMED:
      return `Reason: ${details.reason}. Platforms: ${details.platforms?.join(", ") || "N/A"}.`
    case EventType.RECOVERY_INITIATED:
      return `Stage: ${details.stage}.`
    case EventType.CONTACTS_ALERTED:
      return `Alerted ${details.count} contacts.`
    default:
      return (
        Object.entries(details)
          .map(([key, value]) => `${key}: ${value}`)
          .join("; ") || "No additional details."
      )
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const {
    userProfile,
    contacts,
    activityLog,
    isLoading: contextIsLoading,
    contextError,
    simulateBreachByContactFlag,
    initiateRecovery,
    setContextError,
    resetSessionData,
    clearLocalStorage,
  } = useReclaim()

  useEffect(() => {
    if (!contextIsLoading && !userProfile && contextError !== "Cannot simulate breach without a user profile.") {
      // Critical error handling is now done before this component renders if userProfile is null
    }
  }, [contextIsLoading, userProfile, router, contextError])

  const statusInfo = useMemo(() => {
    if (!userProfile) return { title: "Loading...", description: "Please wait...", icon: <Loader2 className="h-4 w-4 animate-spin" /> }

    switch (userProfile.currentStatus) {
      case "compromised":
        return {
          title: "Account Compromised",
          description: "Your account has been compromised. Begin the recovery process to secure your identity.",
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          isPhoneIssue: userProfile.breachTriggerDetails?.isPhoneIssue,
          showRecoveryButton: true,
        }
      case "recovering":
        return {
          title: "Recovery In Progress",
          description: "Your account is in the process of being recovered.",
          icon: <RefreshCw className="h-4 w-4 text-yellow-500" />,
        }
      case "recovered":
        return {
          title: "Recovery Complete",
          description: "Your account has been successfully recovered.",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        }
      case "under_review":
        return {
          title: "Under Security Review",
          description: "Your account is being reviewed for potential security issues.",
          icon: <Search className="h-4 w-4 text-yellow-500" />,
        }
      default:
        return {
          title: "Account Secure",
          description: "No security issues detected.",
          icon: <Shield className="h-4 w-4 text-green-500" />,
        }
    }
  }, [userProfile])

  const handleSimulatePhoneBreach = () => {
    if (!userProfile) {
      setContextError("Cannot simulate breach without a user profile.") // This should ideally not happen if dashboard loaded
      return
    }
    simulateBreachByContactFlag("Demo Contact Alice", true, "SIM Swap Attempt")
    router.push("/security-review") // Or a more specific phone review page
  }

  const handleReset = () => {
    clearLocalStorage()
    router.refresh()
  }

  const noActiveContactsWarning = contextError === "No active contacts to alert."

  const handleBeginRecovery = () => {
    if (userProfile?.currentStatus === "compromised") {
      initiateRecovery()
      router.push("/recovery-process")
    }
  }

  if (contextIsLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading dashboard...</div>
  }

  if (!userProfile) {
    // This state should ideally be caught by a higher-level component or router logic
    // if the context fails to load the profile entirely.
    // However, as a fallback within the dashboard:
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
        <p className="text-red-600 mb-4">
          {contextError || "User profile could not be loaded. Please try resetting the session or contact support."}
        </p>
        <Button onClick={resetSessionData}>Reset Session Data</Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black">MyMesh Dashboard</h1>
            <Button
              onClick={clearLocalStorage}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear Data
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-[#1C1C1C]">Welcome, {userProfile.name}</h1>
          <div className="flex gap-3">
            <Button onClick={handleSimulatePhoneBreach} variant="destructive" className="rounded-full px-6">
              Simulate Phone Breach
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Security Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Security Status</h2>
              {statusInfo.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{statusInfo.title}</div>
              <p className="text-gray-500">{statusInfo.description}</p>
              {statusInfo.isPhoneIssue && userProfile.currentStatus === "compromised" && userProfile.phoneNumber && (
                <>
                  <p className="text-gray-500 mt-1">Monitoring: {userProfile.phoneNumber}</p>
                  <p className="text-gray-500">Issue Type: {userProfile.breachTriggerDetails?.phoneIssueType}</p>
                </>
              )}
              {statusInfo.showRecoveryButton && (
                <Button onClick={handleBeginRecovery} className="mt-4 w-full">
                  Begin Recovery Process
                </Button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col space-y-2 mb-4">
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
              <p className="text-gray-500">Manage your security and contacts.</p>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/manage-contacts" className="block">
                <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <UserCheck className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Manage Emergency Contacts</span>
                </div>
              </Link>
              <Link href="/report-phone-issue" className="block">
                <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Report Phone Security Issue</span>
                </div>
              </Link>
              <Link href="/report-suspicion" className="block">
                <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">Report Other Suspicious Activity</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-2">Recent Activity</h2>
          <p className="text-gray-600 mb-6">Overview of recent security events.</p>
          {activityLog.length > 0 ? (
            <ul className="space-y-4">
              {activityLog.slice(0, 5).map((entry) => (
                <li key={entry.activityId} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {entry.eventType.includes("PHONE") || entry.details.platform === "Phone Security" ? (
                      <Smartphone className="h-5 w-5 text-green-500" />
                    ) : entry.eventType.includes("FAIL") || entry.eventType.includes("COMPROMISE") ? (
                      <AlertTriangle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">{formatActivityDetails(entry)}</p>
                    <p className="text-sm text-gray-400">{formatDisplayTimestamp(entry.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  )
}
