"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RotateCw, Eye, AlertTriangle } from "lucide-react" // Icons
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useReclaim } from "@/contexts/reclaim-context"
import type { Notification } from "@/lib/reclaim-types" // Import types
import { formatShortTimestamp } from "@/lib/utils"

const getStatusColor = (status: Notification["deliveryStatus"]) => {
  switch (status) {
    case "sent":
      return "text-blue-600"
    case "delivered":
      return "text-green-600"
    case "read":
      return "text-purple-600"
    case "failed":
      return "text-red-600"
    case "pending":
    default:
      return "text-neutral-500"
  }
}

export default function AlertingNetworkPage() {
  const router = useRouter()
  const {
    userProfile,
    contacts: contextContacts,
    notifications: contextNotifications,
    isLoading,
    error,
    logActivity, // For "Send Additional Alert"
  } = useReclaim()

  // Filter for active breach alert notifications
  const activeBreachNotifications = useMemo(() => {
    return contextNotifications.filter((n) => n.notificationType === "breach_alert")
  }, [contextNotifications])

  const contactsReached = useMemo(() => {
    return activeBreachNotifications.filter(
      (n) => n.deliveryStatus === "sent" || n.deliveryStatus === "delivered" || n.deliveryStatus === "read",
    ).length
  }, [activeBreachNotifications])

  const systemGeneratedMessage = useMemo(() => {
    if (activeBreachNotifications.length > 0) {
      return activeBreachNotifications[0].messageContent
    }
    if (userProfile) {
      // Fallback message if no notifications yet (should be rare if navigated correctly)
      return `Security alert: ${userProfile.name}'s identity may be compromised.
Verified: ${formatShortTimestamp(userProfile.lastVerification)}
Affected Systems: [Details pending notification dispatch]
Do not trust communications from these systems.
Signed: ReclaimClientSig`
    }
    return "Alert message content will appear here once notifications are sent."
  }, [activeBreachNotifications, userProfile])

  // Redirect if user is not compromised or no profile
  useEffect(() => {
    if (!isLoading && (!userProfile || userProfile.currentStatus !== "compromised")) {
      console.log("User not compromised or no profile, redirecting to dashboard from alerting network.")
      router.push("/dashboard")
    }
  }, [userProfile, isLoading, router])

  const handleSendAdditionalAlert = async () => {
    // This is a placeholder. In a real app, you'd open a dialog to compose a message.
    const customMessage = prompt(
      "Enter your custom message to send to contacts:",
      "Please be extra vigilant. I will contact you via a secure channel soon.",
    )
    if (customMessage && userProfile) {
      const now = new Date().toISOString()
      const additionalNotifications: Notification[] = contextContacts
        .filter((c) => c.status === "active") // Ensure we only alert active contacts
        .map((contact) => ({
          notificationId: `notif_additional_${Date.now()}_${contact.contactId}`,
          userId: userProfile.userId,
          contactId: contact.contactId,
          messageContent: customMessage,
          sentAt: now,
          deliveryStatus: "pending", // Simulate sending
          notificationType: "additional_alert",
        }))

      // In a real app, you'd have a context function to send these
      // For now, we can log the intent and perhaps update UI if we had a place for additional_alerts
      console.log("Simulating sending additional alerts:", additionalNotifications)
      await logActivity("additional_alert_sent", {
        count: additionalNotifications.length,
        messagePreview: customMessage.substring(0, 50),
      })
      alert("Simulated sending an additional custom alert.")
      // Here you would call a context function like `sendCustomAlerts(customMessage)`
      // which would then update `contextNotifications` and trigger re-renders.
    }
  }

  if (isLoading) {
    return <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">Loading alert status...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center text-red-500">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <p>Error: {error}</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  if (!userProfile || userProfile.currentStatus !== "compromised") {
    // Should be caught by useEffect, but as a fallback
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16 text-center">
        <p>No active compromise event found.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="space-y-10 md:space-y-12">
        {/* Notification Status Section */}
        <section aria-labelledby="notification-status-heading" className="text-center">
          <h1 id="notification-status-heading" className="text-4xl md:text-5xl font-bold text-black mb-2">
            Alerting Network
          </h1>
          <p className="text-lg text-neutral-700 mb-3">Your trusted contacts are being notified.</p>
          <p className="font-mono text-md text-neutral-600 bg-neutral-100 px-3 py-2 inline-block rounded">
            {contactsReached} of {contextContacts.filter((c) => c.status === "active").length} active contacts processed
          </p>
        </section>

        <Separator className="bg-neutral-200" />

        {/* Contact List Section */}
        <section aria-labelledby="contact-list-heading">
          <h2 id="contact-list-heading" className="text-xl font-semibold text-black mb-4">
            Notification Log
          </h2>
          {contextContacts.filter((c) => c.status === "active").length > 0 ? (
            <div className="space-y-3">
              {contextContacts
                .filter((c) => c.status === "active")
                .map((contact) => {
                  const notification = activeBreachNotifications.find((n) => n.contactId === contact.contactId)
                  const status = notification?.deliveryStatus || "Pending"
                  const timestamp = notification?.sentAt || null

                  return (
                    <div
                      key={contact.contactId}
                      className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-neutral-100 last:border-b-0"
                    >
                      <div className="mb-1 sm:mb-0">
                        <p className="text-md text-neutral-800">{contact.name}</p>
                        <p className="font-mono text-xs text-neutral-500">{contact.contactMethod}</p>
                      </div>
                      <div className="flex items-center self-start sm:self-center">
                        <span className={`text-sm font-medium mr-2 ${getStatusColor(status)}`}>{status}</span>
                        <span className="font-mono text-xs text-neutral-400">{formatShortTimestamp(timestamp)}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-neutral-500 text-center">No active contacts to notify.</p>
          )}
        </section>

        <Separator className="bg-neutral-200" />

        {/* Message Preview Section */}
        <section aria-labelledby="message-preview-heading">
          <h2 id="message-preview-heading" className="text-xl font-semibold text-black mb-3">
            Alert Content
          </h2>
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
            <pre className="font-mono text-sm text-neutral-700 whitespace-pre-wrap break-all">
              {systemGeneratedMessage}
            </pre>
          </div>
        </section>

        <Separator className="bg-neutral-200" />

        {/* Actions Section */}
        <section aria-labelledby="actions-heading" className="text-center">
          <h2 id="actions-heading" className="sr-only">
            Further Actions
          </h2>
          <div className="space-y-4 md:space-y-0 md:flex md:flex-row-reverse md:justify-center md:space-x-4 md:space-x-reverse">
            <Button
              onClick={handleSendAdditionalAlert}
              size="lg"
              className="w-full md:w-auto bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 py-3 text-lg rounded-md"
              aria-label="Send an additional alert message"
              disabled={isLoading || contextContacts.filter((c) => c.status === "active").length === 0}
            >
              <RotateCw className="mr-2 h-5 w-5" /> Send Additional Alert
            </Button>
            <Link href="/dashboard" passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full md:w-auto border-neutral-700 text-neutral-700 hover:bg-neutral-100 px-8 py-3 text-lg rounded-md"
                aria-label="View overall recovery status"
              >
                <a>
                  <Eye className="mr-2 h-5 w-5" /> View Recovery Status
                </a>
              </Button>
            </Link>
          </div>
        </section>
        <Separator className="bg-neutral-200" />
        <footer className="text-center py-4">
          <p className="font-mono text-xs text-neutral-400">Reclaim Notification System</p>
        </footer>
      </div>
    </div>
  )
}
