import { type UserProfile, type Contact, type ActivityLogEntry, type Notification, EventType } from "./reclaim-types"
import { formatShortTimestamp } from "./utils" // Assuming formatShortTimestamp is declared in utils.ts

const USER_ID_V = "user_v_harder_123"

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
// const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // Not used, can be removed
// const now = new Date().toISOString() // Not used, can be removed

const vUserProfile: UserProfile = {
  userId: USER_ID_V,
  name: "V. Harder",
  authMethod: "civic:0xVAuthToken",
  createdAt: threeDaysAgo,
  currentStatus: "safe",
  lastVerification: threeDaysAgo,
  biometricHash: "encrypted_v_bio_hash_placeholder",
  // Ensure phoneNumber is part of the base demo profile if context expects it
  phoneNumber: "+1 (555) 123-4567",
}

const vContacts: Contact[] = [
  {
    contactId: "con_v_1",
    userId: USER_ID_V,
    name: "Michael Lee",
    contactMethod: "michael.lee@example.com",
    type: "email",
    relationship: "Friend",
    addedAt: threeDaysAgo,
    status: "active",
    lastNotified: null,
  }
]

const vActivityLog: ActivityLogEntry[] = [
  {
    activityId: "act_1",
    userId: USER_ID_V,
    eventType: EventType.USER_ONBOARDED,
    timestamp: threeDaysAgo,
    details: { authMethod: "Civic" },
    systemSource: "OnboardingFlow",
  },
  {
    activityId: "act_2",
    userId: USER_ID_V,
    eventType: EventType.IDENTITY_VERIFIED,
    timestamp: new Date(new Date(threeDaysAgo).getTime() + 5 * 60000).toISOString(),
    details: { method: "biometric_video" },
    systemSource: "OnboardingFlow",
  },
  {
    activityId: "act_contact_add_1",
    userId: USER_ID_V,
    eventType: EventType.CONTACT_ADDED,
    timestamp: new Date(new Date(threeDaysAgo).getTime() + 10 * 60000).toISOString(),
    details: { contactId: "con_v_1", name: "Michael Lee" },
    systemSource: "OnboardingFlow",
  }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const vNotifications: Notification[] = []

export const demoData = {
  userProfile: vUserProfile,
  contacts: vContacts,
  activityLog: vActivityLog,
  notifications: vNotifications,
}

export const demoDataInitial = {
  userProfile: { ...vUserProfile },
  contacts: [...vContacts],
  activityLog: [...vActivityLog],
  notifications: [...vNotifications],
}

// Export individual constants for direct import
export const DEMO_USER_PROFILE: UserProfile = {
  userId: "user_v_harder_123",
  authMethod: "demo",
  createdAt: new Date().toISOString(),
  currentStatus: "safe",
  recoveryStage: null,
  lastVerification: new Date().toISOString(),
  name: "V. Harder",
  phoneNumber: "+1 (555) 123-4567",
  breachTriggerDetails: undefined,
  reviewRequestDetails: undefined,
}

export const DEMO_CONTACTS = [
  {
    contactId: "con_alice_123",
    userId: "user_v_harder_123",
    name: "Alice Johnson",
    contactMethod: "alice@example.com",
    type: "email",
    relationship: "Close Friend",
    status: "active",
    addedAt: new Date().toISOString(),
    lastNotified: null,
    recoveryVoteStatus: "pending",
    recoveryVoteTimestamp: null,
  },
  {
    contactId: "con_bob_123",
    userId: "user_v_harder_123",
    name: "Bob Smith",
    contactMethod: "+1 (555) 987-6543",
    type: "phone",
    relationship: "Family Member",
    status: "active",
    addedAt: new Date().toISOString(),
    lastNotified: null,
    recoveryVoteStatus: "pending",
    recoveryVoteTimestamp: null,
  },
]

export const DEMO_ACTIVITY_LOG = [
  {
    activityId: "act_setup_123",
    userId: "user_v_harder_123",
    eventType: EventType.USER_ONBOARDED,
    timestamp: new Date().toISOString(),
    details: {
      setupType: "initial",
      verificationMethod: "email",
    },
    systemSource: "DemoSystem",
  },
]

export const DEMO_NOTIFICATIONS = [
  {
    notificationId: "not_welcome_123",
    userId: "user_v_harder_123",
    notificationType: "welcome",
    content: "Welcome to Reclaim! Your account security is our priority.",
    timestamp: new Date().toISOString(),
    isRead: false,
  },
]

// Keep the combined export if it's used elsewhere, or remove if not.
// For now, I'll keep it commented out to avoid potential conflicts if not used.
/*
export const vHarderDemoData = {
  userProfile: DEMO_USER_PROFILE,
  contacts: DEMO_CONTACTS,
  activityLog: DEMO_ACTIVITY_LOG,
  notifications: DEMO_NOTIFICATIONS,
};
*/
