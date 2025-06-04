import type { UserProfile, Contact, ActivityLogEntry, Notification } from "./reclaim-types"
import { formatShortTimestamp } from "./utils" // Assuming formatShortTimestamp is declared in utils.ts

const USER_ID_SARAH = "user_sarah_chen_123"

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
const now = new Date().toISOString()

const sarahUserProfile: UserProfile = {
  userId: USER_ID_SARAH,
  name: "Sarah Chen",
  authMethod: "civic:0xSarahAuthToken",
  createdAt: threeDaysAgo,
  currentStatus: "recovered", // Starts as recovered after the full demo flow
  lastVerification: sixHoursAgo, // After recovery completed
  biometricHash: "encrypted_sarah_bio_hash_placeholder",
}

const sarahContacts: Contact[] = [
  {
    contactId: "con_sarah_1",
    userId: USER_ID_SARAH,
    name: "Michael Lee",
    contactMethod: "michael.lee@example.com",
    type: "email",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
  {
    contactId: "con_sarah_2",
    userId: USER_ID_SARAH,
    name: "Emily Carter",
    contactMethod: "+15552345678",
    type: "phone",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
  {
    contactId: "con_sarah_3",
    userId: USER_ID_SARAH,
    name: "David Rodriguez",
    contactMethod: "david.r@example.com",
    type: "email",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
  {
    contactId: "con_sarah_4",
    userId: USER_ID_SARAH,
    name: "Olivia Patel",
    contactMethod: "+15558765432",
    type: "phone",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
  {
    contactId: "con_sarah_5",
    userId: USER_ID_SARAH,
    name: "Kevin Cho",
    contactMethod: "kevin.cho@example.com",
    type: "email",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
]

const sarahActivityLog: ActivityLogEntry[] = [
  {
    activityId: "act_1",
    userId: USER_ID_SARAH,
    eventType: "user_onboarded",
    timestamp: threeDaysAgo,
    details: { authMethod: "Civic" },
    systemSource: "OnboardingFlow",
  },
  {
    activityId: "act_2",
    userId: USER_ID_SARAH,
    eventType: "identity_verified",
    timestamp: new Date(new Date(threeDaysAgo).getTime() + 5 * 60000).toISOString(),
    details: { method: "biometric_video" },
    systemSource: "OnboardingFlow",
  },
  ...sarahContacts.map((c, i) => ({
    activityId: `act_contact_add_${i}`,
    userId: USER_ID_SARAH,
    eventType: "contact_added" as const,
    timestamp: new Date(new Date(threeDaysAgo).getTime() + (10 + i) * 60000).toISOString(),
    details: { contactId: c.contactId, name: c.name },
    systemSource: "OnboardingFlow",
  })),
  {
    activityId: "act_3",
    userId: USER_ID_SARAH,
    eventType: "system_check_completed",
    timestamp: twoDaysAgo,
    details: { status: "all_clear" },
    systemSource: "SystemMonitor",
  },
  {
    activityId: "act_4",
    userId: USER_ID_SARAH,
    eventType: "system_check_completed",
    timestamp: yesterday,
    details: { status: "all_clear" },
    systemSource: "SystemMonitor",
  },
  {
    activityId: "act_5",
    userId: USER_ID_SARAH,
    eventType: "breach_detected",
    timestamp: new Date(new Date(yesterday).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    details: { source: "DarkWebOracle", affectedAccounts: ["WhatsApp", "Instagram"] },
    systemSource: "BreachDetectionService",
  },
  {
    activityId: "act_6",
    userId: USER_ID_SARAH,
    eventType: "identity_reverified",
    timestamp: twelveHoursAgo,
    details: { method: "breach_response_video" },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_7",
    userId: USER_ID_SARAH,
    eventType: "contacts_alerted",
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 5 * 60000).toISOString(),
    details: { count: 5, affectedAccounts: ["WhatsApp", "Instagram"] },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_8",
    userId: USER_ID_SARAH,
    eventType: "recovery_initiated",
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 10 * 60000).toISOString(),
    details: { method: "user_action" },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_9_vote1",
    userId: USER_ID_SARAH,
    eventType: "contact_vote_received",
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 1 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_1", name: "Michael Lee", vote: true },
    systemSource: "RecoveryService",
  },
  {
    activityId: "act_9_vote2",
    userId: USER_ID_SARAH,
    eventType: "contact_vote_received",
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_2", name: "Emily Carter", vote: true },
    systemSource: "RecoveryService",
  },
  {
    activityId: "act_9_vote3",
    userId: USER_ID_SARAH,
    eventType: "contact_vote_received",
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 3 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_3", name: "David Rodriguez", vote: true },
    systemSource: "RecoveryService",
  },
  // Assuming 2 contacts didn't vote or voted no, but 3/5 is enough for recovery
  {
    activityId: "act_10",
    userId: USER_ID_SARAH,
    eventType: "recovery_completed",
    timestamp: sixHoursAgo,
    details: { method: "social_consensus", votesFor: 3, votesAgainst: 0, votesNeeded: 3 },
    systemSource: "RecoveryService",
  },
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Ensure chronological order (newest first)

const sarahNotifications: Notification[] = sarahContacts.map((contact, index) => {
  let deliveryStatus: Notification["deliveryStatus"] = "pending"
  if (index < 2)
    deliveryStatus = "read" // First 2 read
  else if (index < 5) deliveryStatus = "delivered" // Next 3 delivered

  return {
    notificationId: `notif_sarah_${contact.contactId}`,
    userId: USER_ID_SARAH,
    contactId: contact.contactId,
    messageContent: `Security alert: Sarah Chen's identity may be compromised. Verified: ${formatShortTimestamp(twelveHoursAgo)} Affected Systems: WhatsApp, Instagram. Do not trust communications from these systems. Signed: ReclaimSystemSig`,
    sentAt: new Date(new Date(twelveHoursAgo).getTime() + 5 * 60000).toISOString(), // Same as contacts_alerted event
    deliveryStatus: deliveryStatus,
    notificationType: "breach_alert",
  }
})

export const sarahChenDemoData = {
  userProfile: sarahUserProfile,
  contacts: sarahContacts,
  activityLog: sarahActivityLog,
  notifications: sarahNotifications,
}
