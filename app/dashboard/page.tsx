"use client"

import type React from "react"
import { useEffect } from "react"
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
  const {
    userProfile,
    activityLog,
    isLoading: contextIsLoading,
    contextError,
    setContextError,
    simulateBreachByContactFlag,
    resetSessionData,
  } = useReclaim()
  const router = useRouter()

  useEffect(() => {
    if (!contextIsLoading && !userProfile && contextError !== "Cannot simulate breach without a user profile.") {
      // Critical error handling is now done before this component renders if userProfile is null
    }
  }, [contextIsLoading, userProfile, router, contextError])

  const statusInfo = getStatusInfo(userProfile)
  const icon = userProfile ? (
    getStatusIcon(userProfile.currentStatus, statusInfo.isPhoneIssue)
  ) : (
    <ShieldCheck className="h-6 w-6 text-gray-500" />
  )

  const handleSimulatePhoneBreach = () => {
    if (!userProfile) {
      setContextError("Cannot simulate breach without a user profile.") // This should ideally not happen if dashboard loaded
      return
    }
    simulateBreachByContactFlag("Demo Contact Alice", true, "SIM Swap Attempt")
    router.push("/security-review") // Or a more specific phone review page
  }

  const noActiveContactsWarning = contextError === "No active contacts to alert."

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userProfile.name}</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={resetSessionData} variant="outline">
            Reset Session
          </Button>
          <Button onClick={handleSimulatePhoneBreach} variant="destructive">
            Simulate Phone Breach
          </Button>
        </div>
      </header>

      {noActiveContactsWarning && (
        <Card className="mb-6 bg-yellow-50 border-yellow-400">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-700 text-lg">Alerting Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              {contextError} Your contacts could not be notified automatically. Please manage your recovery process
              accordingly.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusInfo.title}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{statusInfo.description}</p>
            {statusInfo.isPhoneIssue && userProfile.currentStatus === "safe" && userProfile.phoneNumber && (
              <>
                <p className="text-xs text-gray-500 mt-1">Monitoring: {userProfile.phoneNumber}</p>
                <p className="text-xs text-gray-500">
                  Last verified: {formatShortTimestamp(userProfile.lastVerification)}
                </p>
              </>
            )}
            {!statusInfo.isPhoneIssue && userProfile.currentStatus === "safe" && (
              <p className="text-xs text-gray-500 mt-1">
                Last check: {formatShortTimestamp(userProfile.lastVerification)}
              </p>
            )}
          </CardContent>
          {statusInfo.action && <CardFooter>{statusInfo.action}</CardFooter>}
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your security and contacts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/manage-contacts">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" /> Manage Emergency Contacts
              </Button>
            </Link>
            <Link href="/report-phone-issue">
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="mr-2 h-4 w-4" /> Report Phone Security Issue
              </Button>
            </Link>
            <Link href="/report-suspicion">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" /> Report Other Suspicious Activity
              </Button>
            </Link>
          </CardContent>
        </Card>

        {(userProfile.currentStatus === "recovering" || userProfile.currentStatus === "compromised") && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recovery Checklist</CardTitle>
              <CardDescription>Steps to secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ListChecks className="mr-2 h-4 w-4 text-green-500" /> Secure primary email
                </li>
                <li className="flex items-center">
                  <ListChecks className="mr-2 h-4 w-4 text-gray-400" /> Change critical passwords
                </li>
                <li className="flex items-center">
                  <ListChecks className="mr-2 h-4 w-4 text-gray-400" /> Review active sessions
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/recovery-process">
                <Button variant="secondary" className="w-full">
                  Full Recovery Guide
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent security events.</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLog.length > 0 ? (
              <ul className="space-y-3">
                {activityLog.slice(0, 5).map((entry) => (
                  <li key={entry.activityId} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-100">
                    <div className="flex-shrink-0 pt-1">
                      {entry.eventType.includes("PHONE") || entry.details.platform === "Phone Security" ? (
                        <Smartphone className="h-5 w-5 text-blue-500" />
                      ) : entry.eventType.includes("FAIL") || entry.eventType.includes("COMPROMISE") ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {entry.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">{formatActivityDetails(entry)}</p>
                      <p className="text-xs text-gray-400">{formatDisplayTimestamp(entry.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
