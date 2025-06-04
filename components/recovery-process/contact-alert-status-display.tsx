import type { Contact, Notification } from "@/lib/reclaim-types"
import { formatDisplayTimestamp, formatShortTimestamp } from "@/lib/reclaim-types"
import { Mail, Phone, CheckCircle, Send, Eye, AlertCircle, Loader2 } from "lucide-react"

interface ContactAlertStatusDisplayProps {
  contacts: Contact[]
  notifications: Notification[]
  userName: string
  compromisedPlatforms: string[]
  lastVerifiedTimestamp: string
}

const getStatusIcon = (status: Notification["deliveryStatus"] | "pending_dispatch") => {
  switch (status) {
    case "read":
      return <Eye className="w-4 h-4 text-purple-500" />
    case "delivered":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "sent":
      return <Send className="w-4 h-4 text-blue-500" />
    case "pending_dispatch": // Not yet in notifications list
      return <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
    case "pending": // In notifications list, but still pending send by system
      return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-500" />
    default:
      return <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
  }
}

const getStatusText = (status: Notification["deliveryStatus"] | "pending_dispatch") => {
  switch (status) {
    case "read":
      return "Read"
    case "delivered":
      return "Delivered"
    case "sent":
      return "Sent"
    case "pending_dispatch":
      return "Queued"
    case "pending":
      return "Sending"
    case "failed":
      return "Failed"
    default:
      return "Processing"
  }
}

export default function ContactAlertStatusDisplay({
  contacts,
  notifications,
  userName,
  compromisedPlatforms,
  lastVerifiedTimestamp,
}: ContactAlertStatusDisplayProps) {
  const alertMessagePreview = `Security Alert: ${userName}'s identity has been confirmed as compromised.
Verified: ${formatShortTimestamp(lastVerifiedTimestamp)}
Affected Systems: ${compromisedPlatforms.join(", ")}
Do not trust communications from these accounts until further notice.
Signed: ReclaimSystemSig`

  return (
    <section aria-labelledby="contact-alert-status-heading">
      <h2 id="contact-alert-status-heading" className="text-xl font-semibold text-black mb-1 text-center">
        Alerting Emergency Network
      </h2>
      <p className="text-sm text-neutral-600 mb-4 text-center">
        Your trusted contacts are being notified about the confirmed compromise.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact List */}
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-neutral-700">Notification Status:</h3>
          {contacts.length > 0 ? (
            contacts.map((contact) => {
              const relevantNotification = notifications
                .filter((n) => n.contactId === contact.contactId && n.notificationType === "breach_alert")
                .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0]

              const status = relevantNotification?.deliveryStatus || "pending_dispatch"
              const timestamp = relevantNotification?.sentAt || null

              return (
                <div
                  key={contact.contactId}
                  className="flex justify-between items-center p-3 border border-neutral-200 rounded-md bg-neutral-50/50"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800 flex items-center">
                      {contact.type === "email" ? (
                        <Mail className="w-4 h-4 mr-2 text-neutral-500" />
                      ) : (
                        <Phone className="w-4 h-4 mr-2 text-neutral-500" />
                      )}
                      {contact.name}
                    </p>
                    <p className="text-xs text-neutral-500 ml-6 font-mono">{contact.contactMethod}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs">
                    <span className="flex items-center font-medium">
                      {getStatusIcon(status)}
                      <span className="ml-1.5">{getStatusText(status)}</span>
                    </span>
                    <span className="text-neutral-400 font-mono">{formatDisplayTimestamp(timestamp)}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-neutral-500">No active contacts to alert.</p>
          )}
        </div>

        {/* Alert Content Preview */}
        <div>
          <h3 className="text-md font-semibold text-neutral-700 mb-2">Alert Content Preview:</h3>
          <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-md">
            <pre className="font-mono text-xs text-neutral-700 whitespace-pre-wrap break-words">
              {alertMessagePreview}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
