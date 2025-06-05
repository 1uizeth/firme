"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import {
  type UserProfile,
  type Contact,
  type ActivityLogEntry,
  EventType,
  type ReviewRequestDetails,
  type BreachReport,
  type Notification,
} from "@/lib/reclaim-types"
// This import should now work correctly
import { DEMO_USER_PROFILE, DEMO_CONTACTS, DEMO_ACTIVITY_LOG, DEMO_NOTIFICATIONS } from "@/lib/demo-data"

interface ReclaimContextType {
  userProfile: UserProfile | null
  contacts: Contact[]
  activityLog: ActivityLogEntry[]
  notifications: Notification[]
  isLoading: boolean
  contextError: string | null
  setContextError: (error: string | null) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  addContact: (
    contactData: Omit<Contact, "contactId" | "userId" | "addedAt" | "status" | "lastNotified">,
  ) => Promise<void> // Simplified for addContactAndSendInvitation
  updateContact: (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => Promise<void>
  removeContact: (contactId: string) => Promise<void>
  addActivityLogEntry: (eventType: EventType, details: Record<string, any>, systemSource?: string) => Promise<void>
  setContacts: (contacts: Contact[]) => void // Keep for direct manipulation if needed
  currentBreachReport: BreachReport | null
  setCurrentBreachReport: (report: BreachReport | null) => void
  reportSuspicion: (report: BreachReport) => void
  confirmCompromiseAfterReview: (isPhoneIssue?: boolean, phoneIssueType?: string) => void
  resolveAsFalseAlarm: () => void // Renamed from dismissAsFalseAlarm for clarity
  initiateRecovery: () => void
  sendAlertsToContacts: (affectedPlatforms?: string[]) => boolean // Added affectedPlatforms
  simulateBreachByContactFlag: (contactName: string, isPhoneBreach?: boolean, phoneIssueType?: string) => void
  resetSessionData: () => void
  setPhoneNumber: (phoneNumber: string) => void
  // New functions from manage-contacts page
  addContactAndSendInvitation: (
    contactData: Pick<Contact, "name" | "contactMethod" | "type" | "relationship">,
  ) => Promise<void>
  resendInvitation: (contactId: string) => Promise<void>
  simulateAcceptInvitation: (contactId: string) => Promise<void>
  checkAndExpireInvitations: () => void
  // New functions from security-review page
  initiateSecurityReview: () => void
  dismissAsFalseAlarm: (messageToContact?: string) => Promise<void> // For false alarm screen
  // New functions from recovery-process page
  sendRecoveryMessage: (message: string, additionalContext?: string) => Promise<void>
  simulateContactRecoveryVotes: () => Promise<void>
  completeRecovery: () => Promise<void>
  logActivity: (eventType: EventType, details: Record<string, any>, systemSource?: string) => Promise<void> // For general logging
  reportSuspicionByEmergencyContact: (
    platforms: string[],
    description: string,
    reportingContactName: string,
  ) => Promise<void>
  clearLocalStorage: () => void
}

const initialUserProfile: UserProfile = {
  ...DEMO_USER_PROFILE, // DEMO_USER_PROFILE already has phoneNumber
}

const ReclaimContext = createContext<ReclaimContextType | undefined>(undefined)

export const ReclaimProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [contextError, setContextError] = useState<string | null>(null)
  const [currentBreachReport, setCurrentBreachReport] = useState<BreachReport | null>(null)

  const logActivity = useCallback(
    async (eventType: EventType, details: Record<string, any>, systemSource = "ReclaimAppClient") => {
      if (!userProfile) return
      const newEntry: ActivityLogEntry = {
        activityId: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: userProfile.userId,
        eventType,
        timestamp: new Date().toISOString(),
        details,
        systemSource,
      }
      setActivityLog((prev) => [newEntry, ...prev])
    },
    [userProfile],
  )

  useEffect(() => {
    const loadData = () => {
      try {
        const storedUserProfile = localStorage.getItem("userProfile")
        const storedContacts = localStorage.getItem("contacts")
        const storedActivityLog = localStorage.getItem("activityLog")
        const storedNotifications = localStorage.getItem("notifications")

        if (storedUserProfile) {
          setUserProfile(JSON.parse(storedUserProfile))
        } else {
          setUserProfile(initialUserProfile)
        }

        if (storedContacts) {
          setContacts(JSON.parse(storedContacts))
        } else {
          setContacts(DEMO_CONTACTS)
        }

        if (storedActivityLog) {
          setActivityLog(JSON.parse(storedActivityLog))
        } else {
          setActivityLog(DEMO_ACTIVITY_LOG)
        }

        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications))
        } else {
          setNotifications(DEMO_NOTIFICATIONS)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        setContextError("Failed to load session data. Please try clearing your browser cache or resetting the session.")
        setUserProfile(initialUserProfile)
        setContacts(DEMO_CONTACTS)
        setActivityLog(DEMO_ACTIVITY_LOG)
        setNotifications(DEMO_NOTIFICATIONS)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const saveData = useCallback(() => {
    if (isLoading) return // Don't save while initially loading
    if (userProfile) localStorage.setItem("userProfile", JSON.stringify(userProfile))
    localStorage.setItem("contacts", JSON.stringify(contacts))
    localStorage.setItem("activityLog", JSON.stringify(activityLog))
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [userProfile, contacts, activityLog, notifications, isLoading])

  useEffect(() => {
    saveData()
  }, [saveData])

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      if (!prev) return null
      const updatedProfile = { ...prev, ...updates }
      return updatedProfile
    })
  }

  const addContactAndSendInvitation = async (
    contactData: Pick<Contact, "name" | "contactMethod" | "type" | "relationship">,
  ) => {
    if (!userProfile) return
    const now = new Date()
    const newContact: Contact = {
      ...contactData,
      contactId: `con_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: userProfile.userId,
      addedAt: now.toISOString(),
      status: "pending_invitation",
      lastNotified: null,
      invitationSentAt: now.toISOString(),
      invitationExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
    }
    setContacts((prev) => [...prev, newContact])
    await logActivity(EventType.INVITATION_SENT, { contactName: newContact.name, method: newContact.contactMethod })
  }

  const updateContactState = async (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => {
    setContacts((prev) => prev.map((c) => (c.contactId === contactId ? { ...c, ...updates, userId: c.userId } : c)))
    // Consider logging specific updates if needed
  }

  const removeContactState = async (contactId: string) => {
    const contactToRemove = contacts.find((c) => c.contactId === contactId)
    if (contactToRemove) {
      // Instead of filtering out, mark as 'removed' if you want to keep a record
      // For now, let's filter out for simplicity as per original behavior in manage-contacts
      setContacts((prev) => prev.filter((c) => c.contactId !== contactId))
      await logActivity(EventType.CONTACT_REMOVED, { contactName: contactToRemove.name })
    }
  }

  const resendInvitation = async (contactId: string) => {
    const contact = contacts.find((c) => c.contactId === contactId)
    if (contact && contact.status === "pending_invitation") {
      const now = new Date()
      await updateContactState(contactId, {
        invitationSentAt: now.toISOString(),
        invitationExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      await logActivity(EventType.INVITATION_RESENT, { contactName: contact.name })
    }
  }

  const simulateAcceptInvitation = async (contactId: string) => {
    const contact = contacts.find((c) => c.contactId === contactId)
    if (contact && contact.status === "pending_invitation") {
      await updateContactState(contactId, {
        status: "active",
        invitationAcceptedAt: new Date().toISOString(),
        lastNotified: new Date().toISOString(), // Mark as notified upon activation
      })
      await logActivity(EventType.INVITATION_ACCEPTED, { contactName: contact.name })
      await logActivity(EventType.CONTACT_ACTIVATED, { contactName: contact.name })
    }
  }

  const checkAndExpireInvitations = useCallback(() => {
    const now = new Date()
    let changed = false
    const updatedContacts = contacts.map((contact) => {
      if (
        contact.status === "pending_invitation" &&
        contact.invitationExpiresAt &&
        new Date(contact.invitationExpiresAt) < now
      ) {
        // Optionally log expiry here or let manage-contacts handle display
        // For now, just update status if needed, or rely on display logic
        // To make it explicit, we can add an "expired" status or just let UI handle it.
        // The current UI logic in manage-contacts handles display of expired.
        // No state change needed here unless we want a specific "expired" status.
        changed = true // Just to indicate a check happened
      }
      return contact
    })
    if (changed) {
      // setContacts(updatedContacts); // Only if actual status changes
      console.log("Checked for expired invitations.")
    }
  }, [contacts])

  useEffect(() => {
    checkAndExpireInvitations()
    const interval = setInterval(checkAndExpireInvitations, 60 * 60 * 1000) // Check every hour
    return () => clearInterval(interval)
  }, [checkAndExpireInvitations])

  const reportSuspicion = (report: BreachReport) => {
    if (!userProfile) return
    const reviewDetails: ReviewRequestDetails = {
      reportingContactName: "User Reported",
      reportedPlatforms: [report.platform],
      reportDescription: report.description,
      timestamp: new Date().toISOString(),
      isPhoneIssue: report.isPhoneIssue,
      phoneIssueType: report.phoneIssueType,
    }
    updateUserProfile({
      currentStatus: "under_review",
      reviewRequestDetails: reviewDetails,
    })
    setCurrentBreachReport(report)
    logActivity(
      report.isPhoneIssue
        ? EventType.PHONE_SECURITY_ISSUE_REPORTED_BY_CONTACT
        : EventType.SUSPICION_REPORTED_BY_CONTACT,
      {
        platform: report.platform,
        description: report.description,
        ...(report.isPhoneIssue && { phoneIssueType: report.phoneIssueType }),
        source: "self_report_dashboard",
      },
    )
    setContextError(null)
  }

  const confirmCompromiseAfterReview = (isPhoneIssue?: boolean, phoneIssueType?: string) => {
    if (!userProfile) return
    const breachDetails = {
      type: "user_confirmed_review" as const,
      reason: isPhoneIssue
        ? `Phone issue confirmed: ${phoneIssueType || "General"}`
        : "User confirmed compromise during review",
      timestamp: new Date().toISOString(),
      reportedPlatforms: userProfile.reviewRequestDetails?.reportedPlatforms || ["Unknown"],
      isPhoneIssue: isPhoneIssue,
      phoneIssueType: phoneIssueType,
    }
    updateUserProfile({
      currentStatus: "compromised",
      breachTriggerDetails: breachDetails,
      recoveryStage: "alerting_contacts", // Start recovery process
    })
    logActivity(isPhoneIssue ? EventType.PHONE_COMPROMISE_CONFIRMED : EventType.SECURITY_REVIEW_COMPROMISE_CONFIRMED, {
      reason: breachDetails.reason,
      platforms: breachDetails.reportedPlatforms,
      ...(isPhoneIssue && { phoneIssueType: phoneIssueType }),
    })
    setContextError(null)
    sendAlertsToContacts(breachDetails.reportedPlatforms)
  }

  const resolveAsFalseAlarm = () => {
    // This is the old one, new one is dismissAsFalseAlarm
    if (!userProfile) return
    const reportingContactName = userProfile.reviewRequestDetails?.reportingContactName
    updateUserProfile({
      currentStatus: "safe",
      reviewRequestDetails: undefined,
      breachTriggerDetails: undefined,
    })
    logActivity(EventType.SECURITY_REVIEW_FALSE_ALARM_DISMISSED, {
      resolution: "User marked as false alarm",
      notifiedContact: reportingContactName || "N/A",
    })
    setCurrentBreachReport(null)
    setContextError(null)
  }

  const initiateRecovery = () => {
    if (!userProfile || userProfile.currentStatus !== "compromised") return
    updateUserProfile({ currentStatus: "recovering", recoveryStage: "alerting_contacts" })
    logActivity(
      userProfile.breachTriggerDetails?.isPhoneIssue
        ? EventType.PHONE_RECOVERY_INITIATED
        : EventType.RECOVERY_INITIATED,
      { stage: "alerting_contacts" },
    )
    setContextError(null)
    // Alerts should have been sent when compromise was confirmed.
    // If not, or if re-alerting is desired, call sendAlertsToContacts() here.
  }

  const sendAlertsToContacts = (affectedPlatforms: string[] = ["Unknown"]): boolean => {
    const activeContacts = contacts.filter((c) => c.status === "active")
    if (activeContacts.length === 0) {
      console.warn("No active contacts to alert.")
      setContextError("No active contacts to alert.")
      return false
    }
    activeContacts.forEach((contact) => {
      console.log(
        `Simulating alert to ${contact.name} via ${contact.contactMethod} about ${affectedPlatforms.join(", ")}`,
      )
      updateContactState(contact.contactId, { lastNotified: new Date().toISOString() })
    })
    logActivity(EventType.CONTACTS_ALERTED, {
      count: activeContacts.length,
      contactIds: activeContacts.map((c) => c.contactId),
      platforms: affectedPlatforms,
    })
    setContextError(null)
    return true
  }

  const simulateBreachByContactFlag = (
    contactName: string,
    isPhoneBreach = false,
    phoneIssueType = "Unknown SIM issue",
  ) => {
    if (!userProfile) return
    const reportingContact = contacts.find((c) => c.name === contactName) || contacts[0]
    if (!reportingContact) {
      setContextError("Cannot simulate: No contacts available for reporting.")
      return
    }
    const reviewDetails: ReviewRequestDetails = {
      reportingContactName: reportingContact.name,
      reportingContactId: reportingContact.contactId,
      reportingContactRelationship: reportingContact.relationship,
      reportedPlatforms: isPhoneBreach ? ["Phone Security"] : ["Unknown Platform"],
      reportDescription: isPhoneBreach
        ? `Contact reported potential ${phoneIssueType}.`
        : "Contact reported suspicious activity.",
      timestamp: new Date().toISOString(),
      isPhoneIssue: isPhoneBreach,
      phoneIssueType: isPhoneBreach ? phoneIssueType : undefined,
    }
    updateUserProfile({
      currentStatus: "under_review",
      reviewRequestDetails: reviewDetails,
    })
    logActivity(
      isPhoneBreach ? EventType.PHONE_SECURITY_ISSUE_REPORTED_BY_CONTACT : EventType.CONTACT_FLAGGED_SUSPICION,
      {
        contactName: reportingContact.name,
        relationship: reportingContact.relationship,
        platform: isPhoneBreach ? "Phone Security" : "Unknown Platform",
        ...(isPhoneBreach && { phoneIssueType: phoneIssueType }),
      },
    )
    setContextError(null)
  }

  const resetSessionData = () => {
    setIsLoading(true)
    const freshUserProfile = {
      ...DEMO_USER_PROFILE,
      phoneNumber: userProfile?.phoneNumber || DEMO_USER_PROFILE.phoneNumber,
    }
    setUserProfile(freshUserProfile)
    setContacts(DEMO_CONTACTS)
    setActivityLog(DEMO_ACTIVITY_LOG)
    setCurrentBreachReport(null)
    setContextError(null)
    // localStorage.setItem("userProfile", JSON.stringify(freshUserProfile)); // Done by useEffect
    // localStorage.setItem("contacts", JSON.stringify(DEMO_CONTACTS));
    // localStorage.setItem("activityLog", JSON.stringify(DEMO_ACTIVITY_LOG));
    setIsLoading(false) // Set loading to false after reset
    logActivity(EventType.SYSTEM_CHECK_COMPLETED, { action: "Session data reset" })
  }

  const setPhoneNumber = (phoneNumber: string) => {
    if (userProfile) {
      updateUserProfile({ phoneNumber })
      logActivity(EventType.PHONE_NUMBER_VERIFIED, { phoneNumber })
    }
  }

  // --- Functions for security-review page ---
  const initiateSecurityReview = async () => {
    if (userProfile && userProfile.currentStatus === "under_review") {
      await logActivity(EventType.SECURITY_REVIEW_INITIATED, {
        reportedBy: userProfile.reviewRequestDetails?.reportingContactName || "System",
        platforms: userProfile.reviewRequestDetails?.reportedPlatforms.join(", ") || "N/A",
      })
    }
  }

  const dismissAsFalseAlarm = async (messageToContact?: string) => {
    if (!userProfile) return
    const reportingContactName = userProfile.reviewRequestDetails?.reportingContactName
    updateUserProfile({
      currentStatus: "safe",
      reviewRequestDetails: undefined,
      breachTriggerDetails: undefined,
    })
    await logActivity(EventType.SECURITY_REVIEW_FALSE_ALARM_DISMISSED, {
      resolutionMessage: messageToContact || "No message provided.",
      notifiedContact: reportingContactName || "N/A",
    })
    if (reportingContactName && messageToContact) {
      // Simulate notifying contact
      console.log(`Simulating notification to ${reportingContactName}: ${messageToContact}`)
      await logActivity(EventType.SECURITY_REVIEW_CONTACT_NOTIFIED_OF_RESOLUTION, {
        contactName: reportingContactName,
        resolution: "false_alarm",
        message: messageToContact,
      })
    }
    setCurrentBreachReport(null)
    setContextError(null)
  }

  // --- Functions for recovery-process page ---
  const sendRecoveryMessage = async (message: string, additionalContext?: string) => {
    if (!userProfile || userProfile.currentStatus !== "recovering") return
    await logActivity(EventType.RECOVERY_MESSAGE_COMPOSED, {
      messagePreview: message.substring(0, 50),
      contextPreview: additionalContext?.substring(0, 50),
      contactsNotified: contacts.filter((c) => c.status === "active").length,
    })
    // Simulate sending this message to contacts (e.g., update notifications or log)
    console.log("Simulating sending recovery message:", message, additionalContext)
    alert("Recovery message (simulated) sent to contacts.")
  }

  const simulateContactRecoveryVotes = async () => {
    if (!userProfile || userProfile.currentStatus !== "recovering") return
    const activeContacts = contacts.filter((c) => c.status === "active")
    let votesFor = 0
    activeContacts.forEach((contact) => {
      const vote = Math.random() > 0.2 // 80% chance of approval
      if (vote) votesFor++
      updateContactState(contact.contactId, {
        recoveryVoteStatus: vote ? "approved" : "denied",
        recoveryVoteTimestamp: new Date().toISOString(),
      })
      logActivity(EventType.CONTACT_VOTE_RECEIVED, {
        contactName: contact.name,
        vote: vote ? "approved" : "denied",
      })
    })
    // Check if recovery can proceed
    // This logic might be more complex (e.g., threshold)
    if (votesFor >= Math.ceil(activeContacts.length / 2) && activeContacts.length > 0) {
      updateUserProfile({ recoveryStage: "finalizing" })
      await logActivity(EventType.SOCIAL_VOTING_INITIATED, {
        status: "threshold_met",
        votesFor,
        totalVotes: activeContacts.length,
      })
    } else if (activeContacts.length > 0) {
      await logActivity(EventType.SOCIAL_VOTING_INITIATED, {
        status: "threshold_not_met",
        votesFor,
        totalVotes: activeContacts.length,
      })
      // Potentially set an error or different state if voting fails
    }
  }

  const completeRecovery = async () => {
    if (!userProfile || userProfile.currentStatus !== "recovering" || userProfile.recoveryStage !== "finalizing") return
    updateUserProfile({ currentStatus: "recovered", recoveryStage: null, lastVerification: new Date().toISOString() })
    await logActivity(
      userProfile.breachTriggerDetails?.isPhoneIssue ? EventType.PHONE_SECURITY_RESTORED : EventType.RECOVERY_COMPLETED,
      {
        method: "simulated_completion",
      },
    )
  }

  const reportSuspicionByEmergencyContact = async (
    platforms: string[],
    description: string,
    reportingContactName: string, // Name of the logged-in emergency contact
  ) => {
    if (!userProfile) {
      // This function is called by an emergency contact ABOUT the userProfile.
      // So, userProfile here refers to the person being monitored.
      // We need to ensure this is clear. For now, assume userProfile is the one being reported on.
      setContextError("Target user profile not loaded.")
      return
    }

    const reviewDetails: ReviewRequestDetails = {
      reportingContactName: reportingContactName, // This should be the emergency contact's name
      // reportingContactId: find the ID if available, or pass name
      reportedPlatforms: platforms,
      reportDescription: description,
      timestamp: new Date().toISOString(),
      // Determine if it's a phone issue based on platforms or a dedicated flag from form
      isPhoneIssue: platforms.some((p) => p.toLowerCase().includes("phone")),
      phoneIssueType: platforms.some((p) => p.toLowerCase().includes("phone")) ? "General Phone Concern" : undefined,
    }

    updateUserProfile({
      currentStatus: "under_review",
      reviewRequestDetails: reviewDetails,
    })

    await logActivity(
      reviewDetails.isPhoneIssue
        ? EventType.PHONE_SECURITY_ISSUE_REPORTED_BY_CONTACT
        : EventType.SUSPICION_REPORTED_BY_CONTACT,
      {
        contactName: reportingContactName,
        platforms: platforms.join(", "),
        description: description.substring(0, 100), // Log a preview
        ...(reviewDetails.isPhoneIssue && { phoneIssueType: reviewDetails.phoneIssueType }),
      },
      "EmergencyContactReport",
    )
    setContextError(null)
  }

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("userProfile")
    localStorage.removeItem("contacts")
    localStorage.removeItem("activityLog")
    localStorage.removeItem("notifications")
    setUserProfile(initialUserProfile)
    setContacts(DEMO_CONTACTS)
    setActivityLog(DEMO_ACTIVITY_LOG)
    setNotifications(DEMO_NOTIFICATIONS)
    setContextError(null)
  }, [])

  return (
    <ReclaimContext.Provider
      value={{
        userProfile,
        contacts,
        activityLog,
        notifications,
        isLoading,
        contextError,
        setContextError,
        updateUserProfile,
        addContact: addContactAndSendInvitation,
        updateContact: updateContactState,
        removeContact: removeContactState,
        addActivityLogEntry: logActivity,
        setContacts,
        currentBreachReport,
        setCurrentBreachReport,
        reportSuspicion,
        confirmCompromiseAfterReview,
        resolveAsFalseAlarm,
        initiateRecovery,
        sendAlertsToContacts,
        simulateBreachByContactFlag,
        resetSessionData,
        setPhoneNumber,
        clearLocalStorage,
        addContactAndSendInvitation,
        resendInvitation,
        simulateAcceptInvitation,
        checkAndExpireInvitations,
        initiateSecurityReview,
        dismissAsFalseAlarm,
        sendRecoveryMessage,
        simulateContactRecoveryVotes,
        completeRecovery,
        logActivity,
        reportSuspicionByEmergencyContact,
      }}
    >
      {children}
    </ReclaimContext.Provider>
  )
}

export const useReclaim = (): ReclaimContextType => {
  const context = useContext(ReclaimContext)
  if (context === undefined) {
    throw new Error("useReclaim must be used within a ReclaimProvider")
  }
  return context
}
