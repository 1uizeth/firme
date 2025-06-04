// Data types corresponding to the database schema

export interface ReviewRequestDetails {
  reportingContactName?: string // Name of the contact who reported, or "System"
  reportingContactId?: string // ID of the contact who reported
  reportingContactRelationship?: ContactRelationship // Relationship of the reporting contact
  reportedPlatforms: string[]
  reportDescription?: string
  timestamp: string
}

export interface UserProfile {
  userId: string
  authMethod: string
  createdAt: string // ISO Date string
  currentStatus: "safe" | "compromised" | "recovering" | "recovered" | "under_review"
  recoveryStage?: "alerting_contacts" | "awaiting_social_verification" | "finalizing" | null // New field for recovery sub-status
  lastVerification: string // ISO Date string
  biometricHash?: string // Assuming it might not always be present client-side
  name: string // Added for display, e.g., "Sarah Chen"
  breachTriggerDetails?: {
    type: "contact_flag" | "system_oracle" | "user_confirmed_review"
    contactName?: string
    reason?: string
    timestamp: string
    reportedPlatforms?: string[]
  }
  reviewRequestDetails?: ReviewRequestDetails
}

export type ContactRelationship = "Family" | "Friend" | "Colleague" | "Other"
export type InvitationStatus = "pending" | "accepted" | "expired" | "none"

export interface Contact {
  contactId: string
  userId: string
  name: string
  contactMethod: string
  type: "email" | "phone" | "other"
  relationship: ContactRelationship
  addedAt: string
  status: "active" | "removed" | "pending_invitation"
  lastNotified: string | null
  invitationSentAt?: string | null
  invitationAcceptedAt?: string | null
  invitationExpiresAt?: string | null
  // For recovery tracking (simulated)
  recoveryVoteStatus?: "pending" | "approved" | "denied" | "abstained"
  recoveryVoteTimestamp?: string | null
}

export type EventType =
  | "user_onboarded"
  | "identity_verified"
  | "contact_added"
  | "invitation_sent"
  | "invitation_resent"
  | "invitation_accepted"
  | "invitation_expired"
  | "contact_activated"
  | "contact_updated"
  | "contact_removed"
  | "suspicion_reported_by_contact"
  | "contact_flagged_suspicion"
  | "security_review_initiated"
  | "security_review_identity_verified"
  | "security_review_compromise_confirmed"
  | "security_review_false_alarm_dismissed"
  | "security_review_contact_notified_of_resolution"
  | "breach_detected"
  | "identity_reverified"
  | "contacts_alerted" // General alert
  | "recovery_alerts_sent_to_contacts" // Specific to recovery start
  | "recovery_message_composed" // User customizes recovery message
  | "additional_alert_sent"
  | "recovery_initiated" // User or system starts the recovery process
  | "recovery_process_viewed" // User lands on the recovery page
  | "social_voting_initiated" // System starts collecting votes (simulated)
  | "contact_vote_received"
  | "recovery_completed"
  | "system_check_completed"
  | "account_security_action_checked" // User checks off an item in guidance

export interface ActivityLogEntry {
  activityId: string
  userId: string
  eventType: EventType
  timestamp: string
  details: Record<string, any>
  systemSource: string
}

export interface Notification {
  notificationId: string
  userId: string
  contactId: string
  messageContent: string
  sentAt: string
  deliveryStatus: "pending" | "sent" | "delivered" | "read" | "failed"
  notificationType: "breach_alert" | "additional_alert" | "recovery_request" | "review_resolution" | "recovery_update"
}

export const formatDisplayTimestamp = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A"
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatShortTimestamp = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A"
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Invalid Date"
  }
}
