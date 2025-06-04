// Data types corresponding to the database schema

export interface ReviewRequestDetails {
  reportingContactName?: string
  reportingContactId?: string
  reportingContactRelationship?: ContactRelationship
  reportedPlatforms: string[]
  reportDescription?: string
  timestamp: string
  isPhoneIssue?: boolean
  phoneIssueType?: string
}

export interface UserProfile {
  userId: string
  authMethod: string
  createdAt: string
  currentStatus: "safe" | "compromised" | "recovering" | "recovered" | "under_review"
  recoveryStage?: "alerting_contacts" | "awaiting_social_verification" | "finalizing" | null
  lastVerification: string
  biometricHash?: string
  name: string
  phoneNumber?: string
  breachTriggerDetails?: {
    type: "contact_flag" | "system_oracle" | "user_confirmed_review"
    contactName?: string
    reason?: string
    timestamp: string
    reportedPlatforms?: string[]
    isPhoneIssue?: boolean
    phoneIssueType?: string
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
  recoveryVoteStatus?: "pending" | "approved" | "denied" | "abstained"
  recoveryVoteTimestamp?: string | null
}

export enum SecurityStatus {
  SECURE = "Secure",
  UNDER_REVIEW = "Under Review",
  COMPROMISED = "Compromised",
  PHONE_SECURE = "Phone Secure",
  PHONE_SECURITY_REVIEW = "Phone Security Review",
  PHONE_COMPROMISED = "Phone Compromised",
}

export enum EventType {
  USER_ONBOARDED = "user_onboarded",
  PHONE_NUMBER_VERIFIED = "phone_number_verified",
  EMERGENCY_CONTACT_ADDED = "emergency_contact_added",
  SECURITY_ISSUE_REPORTED = "security_issue_reported",
  SECURITY_ISSUE_RESOLVED = "security_issue_resolved",
  COMPROMISE_CONFIRMED = "compromise_confirmed",
  RECOVERY_INITIATED = "recovery_initiated",
  ACCOUNT_SECURED = "account_secured",
  FALSE_ALARM_CONFIRMED = "false_alarm_confirmed",
  PHONE_SECURITY_CHECK_COMPLETED = "phone_security_check_completed",
  PHONE_SECURITY_ISSUE_REPORTED_BY_CONTACT = "phone_security_issue_reported_by_contact",
  PHONE_COMPROMISE_CONFIRMED = "phone_compromise_confirmed",
  PHONE_RECOVERY_INITIATED = "phone_recovery_initiated",
  PHONE_SECURITY_RESTORED = "phone_security_restored",
  CONTACT_INVITE_SENT = "contact_invite_sent",
  CONTACT_INVITE_ACCEPTED = "contact_invite_accepted",
  CONTACT_RELATIONSHIP_VERIFIED = "contact_relationship_verified",
  IDENTITY_VERIFIED = "identity_verified",
  CONTACT_ADDED = "contact_added",
  INVITATION_SENT = "invitation_sent",
  INVITATION_RESENT = "invitation_resent",
  INVITATION_ACCEPTED = "invitation_accepted",
  INVITATION_EXPIRED = "invitation_expired",
  CONTACT_ACTIVATED = "contact_activated",
  CONTACT_UPDATED = "contact_updated",
  CONTACT_REMOVED = "contact_removed",
  SUSPICION_REPORTED_BY_CONTACT = "suspicion_reported_by_contact",
  CONTACT_FLAGGED_SUSPICION = "contact_flagged_suspicion",
  SECURITY_REVIEW_INITIATED = "security_review_initiated",
  SECURITY_REVIEW_IDENTITY_VERIFIED = "security_review_identity_verified",
  SECURITY_REVIEW_COMPROMISE_CONFIRMED = "security_review_compromise_confirmed",
  SECURITY_REVIEW_FALSE_ALARM_DISMISSED = "security_review_false_alarm_dismissed",
  SECURITY_REVIEW_CONTACT_NOTIFIED_OF_RESOLUTION = "security_review_contact_notified_of_resolution",
  BREACH_DETECTED = "breach_detected",
  IDENTITY_REVERIFIED = "identity_reverified",
  CONTACTS_ALERTED = "contacts_alerted",
  RECOVERY_ALERTS_SENT_TO_CONTACTS = "recovery_alerts_sent_to_contacts",
  RECOVERY_MESSAGE_COMPOSED = "recovery_message_composed",
  ADDITIONAL_ALERT_SENT = "additional_alert_sent",
  RECOVERY_PROCESS_VIEWED = "recovery_process_viewed",
  SOCIAL_VOTING_INITIATED = "social_voting_initiated",
  CONTACT_VOTE_RECEIVED = "contact_vote_received",
  RECOVERY_COMPLETED = "recovery_completed",
  SYSTEM_CHECK_COMPLETED = "system_check_completed",
  ACCOUNT_SECURITY_ACTION_CHECKED = "account_security_action_checked",
}

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

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
}

export interface BreachReport {
  platform: string
  description: string
  reportedAt: string
  isPhoneIssue?: boolean
  phoneIssueType?: string
}

// formatDisplayTimestamp and formatShortTimestamp are now defined in lib/utils.ts
