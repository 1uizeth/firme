"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import {
  type UserProfile,
  type Contact,
  type ActivityLogEntry,
  EventType,
  type ReviewRequestDetails,
  type BreachReport,
  type Notification, // Ensure Notification type is imported
} from "@/lib/reclaim-types"
import { DEMO_USER_PROFILE, DEMO_CONTACTS, DEMO_ACTIVITY_LOG, DEMO_NOTIFICATIONS } from "@/lib/demo-data"

interface ReclaimContextType {
  userProfile: UserProfile | null
  contacts: Contact[]
  activityLog: ActivityLogEntry[]
  notifications: Notification[] // Added notifications
  isLoading: boolean
  contextError: string | null
  setContextError: (error: string | null) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  addContact: (
    contactData: Omit<Contact, "contactId" | "userId" | "addedAt" | "status" | "lastNotified">,
  ) => Promise<void>
  updateContact: (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => Promise<void>
  removeContact: (contactId: string) => Promise<void>
  addActivityLogEntry: (entry: Omit<ActivityLogEntry, "activityId" | "userId" | "timestamp" | "systemSource">) => void
  setContacts: (contacts: Contact[]) => void
  setNotifications: (notifications: Notification[]) => void // Added setNotifications
  currentBreachReport: BreachReport | null
  setCurrentBreachReport: (report: BreachReport | null) => void
  reportSuspicion: (report: BreachReport) => void
  confirmCompromiseAfterReview: (isPhoneIssue?: boolean, phoneIssueType?: string) => void
  resolveAsFalseAlarm: () => void
  initiateRecovery: () => void
  sendAlertsToContacts: (affectedPlatforms?: string[]) => boolean
  simulateBreachByContactFlag: (contactName: string, isPhoneBreach?: boolean, phoneIssueType?: string) => void
  resetSessionData: () => void
  setPhoneNumber: (phoneNumber: string) => void
  addContactAndSendInvitation: (
    contactData: Pick<Contact, "name" | "contactMethod" | "type" | "relationship">,
  ) => Promise<void>
  resendInvitation: (contactId: string) => Promise<void>
  simulateAcceptInvitation: (contactId: string) => Promise<void>
  checkAndExpireInvitations: () => void
  initiateSecurityReview: () => void
  dismissAsFalseAlarm: (messageToContact?: string) => Promise<void>
  sendRecoveryMessage: (message: string, additionalContext?: string) => Promise<void>
  simulateContactRecoveryVotes: () => Promise<void>
  completeRecovery: () => Promise<void>
  logActivity: (eventType: EventType, details: Record<string, any>, systemSource?: string) => Promise<void>
  reportSuspicionByEmergencyContact: (
    platforms: string[],
    description: string,
    reportingContactName: string,
  ) => Promise<void>
}

const initialUserProfile: UserProfile = {
  ...DEMO_USER_PROFILE,
}

const ReclaimContext = createContext<ReclaimContextType | undefined>(undefined)

export const ReclaimProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([]) // Added notifications state
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
        const storedNotifications = localStorage.getItem("notifications") // Load notifications

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
          setNotifications(JSON.parse(storedNotifications)) // Set notifications from localStorage
        } else {
          setNotifications(DEMO_NOTIFICATIONS) // Default to demo notifications
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        setContextError("Failed to load session data. Please try clearing your browser cache or resetting the session.")
        setUserProfile(initialUserProfile)
        setContacts(DEMO_CONTACTS)
        setActivityLog(DEMO_ACTIVITY_LOG)
        setNotifications(DEMO_NOTIFICATIONS) // Default on error
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const saveData = useCallback(() => {
    if (isLoading) return
    if (userProfile) localStorage.setItem("userProfile", JSON.stringify(userProfile))
    localStorage.setItem("contacts", JSON.stringify(contacts))
    localStorage.setItem("activityLog", JSON.stringify(activityLog))
    localStorage.setItem("notifications", JSON.stringify(notifications)) // Save notifications
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
      invitationExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    setContacts((prev) => [...prev, newContact])
    await logActivity(EventType.INVITATION_SENT, { contactName: newContact.name, method: newContact.contactMethod })
  }

  const updateContactState = async (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => {
    setContacts((prev) => prev.map((c) => (c.contactId === contactId ? { ...c, ...updates, userId: c.userId } : c)))
  }

  const removeContactState = async (contactId: string) => {
    const contactToRemove = contacts.find((c) => c.contactId === contactId)
    if (contactToRemove) {
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
        lastNotified: new Date().toISOString(),
      })
      await logActivity(EventType.INVITATION_ACCEPTED, { contactName: contact.name })
      await logActivity(EventType.CONTACT_ACTIVATED, { contactName: contact.name })
    }
  }

  const checkAndExpireInvitations = useCallback(() => {
    const now = new Date()
    let changed = false
    contacts.forEach((contact) => {
      if (
        contact.status === "pending_invitation" &&
        contact.invitationExpiresAt &&
        new Date(contact.invitationExpiresAt) < now
      ) {
        changed = true
      }
    })
    if (changed) {
      console.log("Checked for expired invitations. Some might be expired.")
    }
  }, [contacts])

  useEffect(() => {
    checkAndExpireInvitations()
    const interval = setInterval(checkAndExpireInvitations, 60 * 60 * 1000)
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
    const now = new Date().toISOString()
    const breachDetails = {
      type: "user_confirmed_review" as const,
      reason: isPhoneIssue
        ? `Phone issue confirmed: ${phoneIssueType || "General"}`
        : "User confirmed compromise during review",
      timestamp: now,
      reportedPlatforms: userProfile.reviewRequestDetails?.reportedPlatforms || ["Unknown"],
      isPhoneIssue: isPhoneIssue,
      phoneIssueType: phoneIssueType,
    }
    updateUserProfile({
      currentStatus: "compromised",
      breachTriggerDetails: breachDetails,
      recoveryStage: "alerting_contacts",
    })
    logActivity(isPhoneIssue ? EventType.PHONE_COMPROMISE_CONFIRMED : EventType.SECURITY_REVIEW_COMPROMISE_CONFIRMED, {
      reason: breachDetails.reason,
      platforms: breachDetails.reportedPlatforms,
      ...(isPhoneIssue && { phoneIssueType: phoneIssueType }),
    })
    setContextError(null)
    sendAlertsToContacts(breachDetails.reportedPlatforms, now) // Pass timestamp for notifications
  }

  const resolveAsFalseAlarm = () => {
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
    // Alerts are now sent via confirmCompromiseAfterReview
  }

  const sendAlertsToContacts = (affectedPlatforms: string[] = ["Unknown"], alertTimestamp?: string): boolean => {
    if (!userProfile) return false
    const activeContacts = contacts.filter((c) => c.status === "active")
    if (activeContacts.length === 0) {
      console.warn("No active contacts to alert.")
      setContextError("No active contacts to alert.")
      return false
    }
    const sentAt = alertTimestamp || new Date().toISOString()
    const newNotifications: Notification[] = activeContacts.map((contact) => ({
      notificationId: `notif_${userProfile.userId}_${contact.contactId}_${Date.now()}`,
      userId: userProfile.userId,
      contactId: contact.contactId,
      messageContent: `Security alert: ${userProfile.name}'s identity may be compromised. Verified: ${
        userProfile.lastVerification ? new Date(userProfile.lastVerification).toLocaleTimeString() : "N/A"
      } Affected Systems: ${affectedPlatforms.join(", ")}. Do not trust communications from these systems. Signed: ReclaimSystemSig`,
      sentAt: sentAt,
      deliveryStatus: "pending", // Simulate pending, then update to sent/delivered
      notificationType: "breach_alert",
    }))

    setNotifications((prev) => [...prev, ...newNotifications])

    // Simulate delivery status updates
    newNotifications.forEach((notif) => {
      setTimeout(
        () => {
          setNotifications((prevNots) =>
            prevNots.map((n) => (n.notificationId === notif.notificationId ? { ...n, deliveryStatus: "sent" } : n)),
          )
          setTimeout(
            () => {
              setNotifications((prevNots) =>
                prevNots.map((n) =>
                  n.notificationId === notif.notificationId ? { ...n, deliveryStatus: "delivered" } : n,
                ),
              )
            },
            1500 + Math.random() * 1000,
          ) // Simulate delivery delay
        },
        500 + Math.random() * 500,
      ) // Simulate sending delay
    })

    activeContacts.forEach((contact) => {
      updateContactState(contact.contactId, { lastNotified: sentAt })
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
    setNotifications(DEMO_NOTIFICATIONS) // Reset notifications
    setCurrentBreachReport(null)
    setContextError(null)
    setIsLoading(false)
    logActivity(EventType.SYSTEM_CHECK_COMPLETED, { action: "Session data reset" })
  }

  const setPhoneNumber = (phoneNumber: string) => {
    if (userProfile) {
      updateUserProfile({ phoneNumber })
      logActivity(EventType.PHONE_NUMBER_VERIFIED, { phoneNumber })
    }
  }

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

  const sendRecoveryMessage = async (message: string, additionalContext?: string) => {
    if (!userProfile || userProfile.currentStatus !== "recovering") return
    await logActivity(EventType.RECOVERY_MESSAGE_COMPOSED, {
      messagePreview: message.substring(0, 50),
      contextPreview: additionalContext?.substring(0, 50),
      contactsNotified: contacts.filter((c) => c.status === "active").length,
    })
    console.log("Simulating sending recovery message:", message, additionalContext)
    alert("Recovery message (simulated) sent to contacts.")
  }

  const simulateContactRecoveryVotes = async () => {
    if (!userProfile || userProfile.currentStatus !== "recovering") return
    const activeContacts = contacts.filter((c) => c.status === "active")
    let votesFor = 0
    activeContacts.forEach((contact) => {
      const vote = Math.random() > 0.2
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
    reportingContactName: string,
  ) => {
    if (!userProfile) {
      setContextError("Target user profile not loaded.")
      return
    }
    const reviewDetails: ReviewRequestDetails = {
      reportingContactName: reportingContactName,
      reportedPlatforms: platforms,
      reportDescription: description,
      timestamp: new Date().toISOString(),
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
        description: description.substring(0, 100),
        ...(reviewDetails.isPhoneIssue && { phoneIssueType: reviewDetails.phoneIssueType }),
      },
      "EmergencyContactReport",
    )
    setContextError(null)
  }

  return (
    <ReclaimContext.Provider
      value={{
        userProfile,
        contacts,
        activityLog,
        notifications, // Provide notifications
        isLoading,
        contextError,
        setContextError,
        updateUserProfile,
        addContact: addContactAndSendInvitation,
        updateContact: updateContactState,
        removeContact: removeContactState,
        addActivityLogEntry: logActivity,
        setContacts,
        setNotifications, // Provide setNotifications
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
