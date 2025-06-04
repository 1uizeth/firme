import { type UserProfile, type Contact, type ActivityLogEntry, type Notification, EventType } from "./reclaim-types"
import { formatShortTimestamp } from "./utils" // Assuming formatShortTimestamp is declared in utils.ts

const USER_ID_SARAH = "user_sarah_chen_123"

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
// const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // Not used, can be removed
// const now = new Date().toISOString() // Not used, can be removed

const sarahUserProfile: UserProfile = {
  userId: USER_ID_SARAH,
  name: "Sarah Chen",
  authMethod: "civic:0xSarahAuthToken",
  createdAt: threeDaysAgo,
  currentStatus: "recovered",
  lastVerification: sixHoursAgo,
  biometricHash: "encrypted_sarah_bio_hash_placeholder",
  // Ensure phoneNumber is part of the base demo profile if context expects it
  phoneNumber: "+1 (555) 123-4567",
}

const sarahContacts: Contact[] = [
  {
    contactId: "con_sarah_1",
    userId: USER_ID_SARAH,
    name: "Michael Lee",
    contactMethod: "michael.lee@example.com",
    type: "email",
    relationship: "Friend", // Added relationship
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
    relationship: "Family", // Added relationship
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
    relationship: "Colleague", // Added relationship
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
    relationship: "Friend", // Added relationship
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
    relationship: "Other", // Added relationship
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: twelveHoursAgo,
  },
]

const sarahActivityLog: ActivityLogEntry[] = [
  {
    activityId: "act_1",
    userId: USER_ID_SARAH,
    eventType: EventType.USER_ONBOARDED,
    timestamp: threeDaysAgo,
    details: { authMethod: "Civic" },
    systemSource: "OnboardingFlow",
  },
  {
    activityId: "act_2",
    userId: USER_ID_SARAH,
    eventType: EventType.IDENTITY_VERIFIED,
    timestamp: new Date(new Date(threeDaysAgo).getTime() + 5 * 60000).toISOString(),
    details: { method: "biometric_video" },
    systemSource: "OnboardingFlow",
  },
  ...sarahContacts.map((c, i) => ({
    activityId: `act_contact_add_${i}`,
    userId: USER_ID_SARAH,
    eventType: EventType.CONTACT_ADDED,
    timestamp: new Date(new Date(threeDaysAgo).getTime() + (10 + i) * 60000).toISOString(),
    details: { contactId: c.contactId, name: c.name },
    systemSource: "OnboardingFlow",
  })),
  {
    activityId: "act_3",
    userId: USER_ID_SARAH,
    eventType: EventType.SYSTEM_CHECK_COMPLETED,
    timestamp: twoDaysAgo,
    details: { status: "all_clear" },
    systemSource: "SystemMonitor",
  },
  {
    activityId: "act_4",
    userId: USER_ID_SARAH,
    eventType: EventType.SYSTEM_CHECK_COMPLETED,
    timestamp: yesterday,
    details: { status: "all_clear" },
    systemSource: "SystemMonitor",
  },
  {
    activityId: "act_5",
    userId: USER_ID_SARAH,
    eventType: EventType.BREACH_DETECTED,
    timestamp: new Date(new Date(yesterday).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    details: { source: "DarkWebOracle", affectedAccounts: ["WhatsApp", "Instagram"] },
    systemSource: "BreachDetectionService",
  },
  {
    activityId: "act_6",
    userId: USER_ID_SARAH,
    eventType: EventType.IDENTITY_REVERIFIED,
    timestamp: twelveHoursAgo,
    details: { method: "breach_response_video" },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_7",
    userId: USER_ID_SARAH,
    eventType: EventType.CONTACTS_ALERTED,
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 5 * 60000).toISOString(),
    details: { count: 5, affectedAccounts: ["WhatsApp", "Instagram"] },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_8",
    userId: USER_ID_SARAH,
    eventType: EventType.RECOVERY_INITIATED,
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 10 * 60000).toISOString(),
    details: { method: "user_action" },
    systemSource: "BreachAlertFlow",
  },
  {
    activityId: "act_9_vote1",
    userId: USER_ID_SARAH,
    eventType: EventType.CONTACT_VOTE_RECEIVED,
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 1 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_1", name: "Michael Lee", vote: true },
    systemSource: "RecoveryService",
  },
  {
    activityId: "act_9_vote2",
    userId: USER_ID_SARAH,
    eventType: EventType.CONTACT_VOTE_RECEIVED,
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_2", name: "Emily Carter", vote: true },
    systemSource: "RecoveryService",
  },
  {
    activityId: "act_9_vote3",
    userId: USER_ID_SARAH,
    eventType: EventType.CONTACT_VOTE_RECEIVED,
    timestamp: new Date(new Date(twelveHoursAgo).getTime() + 3 * 60 * 60 * 1000).toISOString(),
    details: { contactId: "con_sarah_3", name: "David Rodriguez", vote: true },
    systemSource: "RecoveryService",
  },
  {
    activityId: "act_10",
    userId: USER_ID_SARAH,
    eventType: EventType.RECOVERY_COMPLETED,
    timestamp: sixHoursAgo,
    details: { method: "social_consensus", votesFor: 3, votesAgainst: 0, votesNeeded: 3 },
    systemSource: "RecoveryService",
  },
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const sarahNotifications: Notification[] = sarahContacts.map((contact, index) => {
  let deliveryStatus: Notification["deliveryStatus"] = "pending"
  if (index < 2) deliveryStatus = "read"
  else if (index < 5) deliveryStatus = "delivered"

  return {
    notificationId: `notif_sarah_${contact.contactId}`,
    userId: USER_ID_SARAH,
    contactId: contact.contactId,
    messageContent: `Security alert: Sarah Chen's identity may be compromised. Verified: ${formatShortTimestamp(twelveHoursAgo)} Affected Systems: WhatsApp, Instagram. Do not trust communications from these systems. Signed: ReclaimSystemSig`,
    sentAt: new Date(new Date(twelveHoursAgo).getTime() + 5 * 60000).toISOString(),
    deliveryStatus: deliveryStatus,
    notificationType: "breach_alert",
  }
})

// Export individual constants for direct import
export const DEMO_USER_PROFILE: UserProfile = sarahUserProfile
export const DEMO_CONTACTS: Contact[] = sarahContacts
export const DEMO_ACTIVITY_LOG: ActivityLogEntry[] = sarahActivityLog
export const DEMO_NOTIFICATIONS: Notification[] = sarahNotifications

// Keep the combined export if it's used elsewhere, or remove if not.
// For now, I'll keep it commented out to avoid potential conflicts if not used.
/*
export const sarahChenDemoData = {
  userProfile: DEMO_USER_PROFILE,
  contacts: DEMO_CONTACTS,
  activityLog: DEMO_ACTIVITY_LOG,
  notifications: DEMO_NOTIFICATIONS,
};
*/
