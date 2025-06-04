"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import type {
  UserProfile,
  Contact,
  ActivityLogEntry,
  Notification,
  EventType,
  ReviewRequestDetails,
} from "@/lib/reclaim-types"
import { formatShortTimestamp } from "@/lib/utils"

const INVITATION_EXPIRY_DAYS = 7

const initialUserProfile: UserProfile = {
  userId: `local_user_${Date.now()}`,
  name: "New User",
  authMethod: "local_session",
  createdAt: new Date().toISOString(),
  currentStatus: "safe",
  recoveryStage: null,
  lastVerification: new Date().toISOString(),
}

interface ReclaimContextState {
  userProfile: UserProfile | null
  contacts: Contact[]
  activityLog: ActivityLogEntry[]
  notifications: Notification[]
  isLoading: boolean
  error: string | null
  initializeSession: (name?: string) => void
  addContactAndSendInvitation: (
    newContactData: Omit<
      Contact,
      | "contactId"
      | "userId"
      | "addedAt"
      | "status"
      | "lastNotified"
      | "invitationSentAt"
      | "invitationExpiresAt"
      | "recoveryVoteStatus"
      | "recoveryVoteTimestamp"
    >,
  ) => Promise<string | null>
  updateContact: (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => Promise<void>
  removeContact: (contactId: string) => Promise<void>
  logActivity: (
    eventType: EventType,
    details: Record<string, any>,
    systemSource?: string,
    customTimestamp?: string,
  ) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  sendAlertsToContacts: (compromisedSystems: string[], alertType?: EventType) => Promise<void>
  initiateRecovery: () => Promise<void>
  completeRecovery: () => Promise<void>
  simulateBreachByContactFlag: () => Promise<void>
  flagSuspicionByContact: (contactId: string, reason: string) => Promise<void>
  reportSuspicionByEmergencyContact: (
    reportedPlatforms: string[],
    description?: string,
    reportingContactId?: string,
  ) => Promise<void>
  resendInvitation: (contactId: string) => Promise<void>
  simulateAcceptInvitation: (contactId: string) => Promise<void>
  checkAndExpireInvitations: () => void
  resetSessionData: () => void
  initiateSecurityReview: () => Promise<void>
  confirmCompromiseAfterReview: () => Promise<void>
  dismissAsFalseAlarm: (messageToContact?: string) => Promise<void>
  sendRecoveryMessage: (message: string, additionalContext?: string) => Promise<void>
  simulateContactRecoveryVotes: () => void // For demo
}

const ReclaimContext = createContext<ReclaimContextState | undefined>(undefined)

export const ReclaimProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeSession = useCallback((name = "New User") => {
    const now = new Date().toISOString()
    const newUserId = `local_user_${Date.now()}`
    setUserProfile({
      userId: newUserId,
      name: name,
      authMethod: "local_session",
      createdAt: now,
      currentStatus: "safe",
      recoveryStage: null,
      lastVerification: now,
    })
    setContacts([])
    setActivityLog([
      {
        activityId: `act_${Date.now()}`,
        userId: newUserId,
        eventType: "user_onboarded",
        timestamp: now,
        details: { name },
        systemSource: "ReclaimClient",
      },
    ])
    setNotifications([])
    setError(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!userProfile) {
      initializeSession()
    }
  }, [initializeSession, userProfile])

  const logActivity = useCallback(
    async (
      eventType: EventType,
      details: Record<string, any>,
      systemSource = "ReclaimClient",
      customTimestamp?: string,
    ) => {
      if (!userProfile) return

      const newEntry: ActivityLogEntry = {
        activityId: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: userProfile.userId,
        eventType: eventType,
        timestamp: customTimestamp || new Date().toISOString(),
        details: details,
        systemSource: systemSource,
      }
      setActivityLog((prev) =>
        [newEntry, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      )
    },
    [userProfile],
  )

  const addContactAndSendInvitation = useCallback(
    async (
      newContactData: Omit<
        Contact,
        | "contactId"
        | "userId"
        | "addedAt"
        | "status"
        | "lastNotified"
        | "invitationSentAt"
        | "invitationExpiresAt"
        | "recoveryVoteStatus"
        | "recoveryVoteTimestamp"
      >,
    ): Promise<string | null> => {
      if (!userProfile) {
        setError("User profile not loaded. Cannot add contact.")
        return null
      }
      setIsLoading(true)
      const now = new Date()
      const invitationSentAt = now.toISOString()
      const invitationExpiresAt = new Date(new Date(now).setDate(now.getDate() + INVITATION_EXPIRY_DAYS)).toISOString()

      const newContact: Contact = {
        contactId: `con_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: userProfile.userId,
        name: newContactData.name,
        contactMethod: newContactData.contactMethod,
        type: newContactData.type,
        relationship: newContactData.relationship,
        addedAt: invitationSentAt,
        status: "pending_invitation",
        lastNotified: null,
        invitationSentAt: invitationSentAt,
        invitationExpiresAt: invitationExpiresAt,
        recoveryVoteStatus: "pending",
        recoveryVoteTimestamp: null,
      }
      setContacts((prev) => [...prev, newContact].sort((a, b) => a.name.localeCompare(b.name)))
      await logActivity("contact_added", {
        contactId: newContact.contactId,
        name: newContact.name,
        method: newContact.contactMethod,
        relationship: newContact.relationship,
      })
      await logActivity(
        "invitation_sent",
        {
          contactId: newContact.contactId,
          name: newContact.name,
          method: newContact.contactMethod,
          expiresAt: invitationExpiresAt,
        },
        "ReclaimClient",
        invitationSentAt,
      )
      setIsLoading(false)
      console.log(`Simulated invitation sent to ${newContact.name} via ${newContact.contactMethod}`)
      return newContact.contactId
    },
    [userProfile, logActivity],
  )

  const resendInvitation = useCallback(
    async (contactId: string) => {
      const contact = contacts.find((c) => c.contactId === contactId)
      if (!contact || contact.status !== "pending_invitation") {
        setError("Contact not found or invitation not pending.")
        return
      }
      setIsLoading(true)
      const now = new Date()
      const newInvitationSentAt = now.toISOString()
      const newInvitationExpiresAt = new Date(
        new Date(now).setDate(now.getDate() + INVITATION_EXPIRY_DAYS),
      ).toISOString()

      setContacts((prev) =>
        prev.map((c) =>
          c.contactId === contactId
            ? { ...c, invitationSentAt: newInvitationSentAt, invitationExpiresAt: newInvitationExpiresAt }
            : c,
        ),
      )
      await logActivity(
        "invitation_resent",
        {
          contactId: contact.contactId,
          name: contact.name,
          method: contact.contactMethod,
          expiresAt: newInvitationExpiresAt,
        },
        "ReclaimClient",
        newInvitationSentAt,
      )
      console.log(`Simulated invitation RESENT to ${contact.name} via ${contact.contactMethod}`)
      setIsLoading(false)
    },
    [contacts, logActivity],
  )

  const simulateAcceptInvitation = useCallback(
    async (contactId: string) => {
      const contact = contacts.find((c) => c.contactId === contactId)
      if (!contact || contact.status !== "pending_invitation") {
        setError("Contact not found or invitation not pending/expired.")
        return
      }
      if (contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < new Date()) {
        setError("Invitation has expired. Please resend.")
        setContacts((prev) => prev.map((c) => (c.contactId === contactId ? { ...c, status: "removed" } : c)))
        await logActivity("invitation_expired", { contactId: contact.contactId, name: contact.name })
        return
      }

      setIsLoading(true)
      const acceptedAt = new Date().toISOString()
      setContacts((prev) =>
        prev.map((c) =>
          c.contactId === contactId
            ? {
                ...c,
                status: "active",
                invitationAcceptedAt: acceptedAt,
                invitationExpiresAt: null,
              }
            : c,
        ),
      )
      await logActivity(
        "invitation_accepted",
        { contactId: contact.contactId, name: contact.name },
        "ContactAction",
        acceptedAt,
      )
      await logActivity("contact_activated", { contactId: contact.contactId, name: contact.name }, "System", acceptedAt)
      setIsLoading(false)
    },
    [contacts, logActivity],
  )

  const checkAndExpireInvitations = useCallback(() => {
    const now = new Date()
    let changed = false
    const updatedContacts = contacts.map((contact) => {
      if (
        contact.status === "pending_invitation" &&
        contact.invitationExpiresAt &&
        new Date(contact.invitationExpiresAt) < now
      ) {
        changed = true
        logActivity("invitation_expired", { contactId: contact.contactId, name: contact.name }, "SystemCron")
        return { ...contact, status: "removed" }
      }
      return contact
    })
    if (changed) {
      setContacts(updatedContacts)
    }
  }, [contacts, logActivity])

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        checkAndExpireInvitations()
      },
      60 * 60 * 1000,
    )
    return () => clearInterval(intervalId)
  }, [checkAndExpireInvitations])

  const updateContact = useCallback(
    async (contactId: string, updates: Partial<Omit<Contact, "contactId" | "userId">>) => {
      setIsLoading(true)
      let updatedContactName = ""
      setContacts((prev) =>
        prev
          .map((c) => {
            if (c.contactId === contactId) {
              const updated = { ...c, ...updates }
              updatedContactName = updated.name
              return updated
            }
            return c
          })
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      if (updatedContactName) {
        await logActivity("contact_updated", { contactId, name: updatedContactName, ...updates })
      }
      setIsLoading(false)
    },
    [logActivity],
  )

  const removeContact = useCallback(
    async (contactId: string) => {
      setIsLoading(true)
      const contactToRemove = contacts.find((c) => c.contactId === contactId)
      setContacts((prev) => prev.filter((c) => c.contactId !== contactId))
      if (contactToRemove) {
        await logActivity("contact_removed", {
          contactId,
          name: contactToRemove.name,
          previousStatus: contactToRemove.status,
        })
      }
      setIsLoading(false)
    },
    [contacts, logActivity],
  )

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!userProfile) return
      setIsLoading(true)
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null))
      setIsLoading(false)
    },
    [userProfile],
  )

  const sendAlertsToContacts = useCallback(
    async (compromisedSystems: string[], alertType: EventType = "contacts_alerted") => {
      if (!userProfile) return
      setIsLoading(true)
      const activeContacts = contacts.filter((c) => c.status === "active")
      if (activeContacts.length === 0) {
        setError("No active contacts to alert.")
        setIsLoading(false)
        return
      }

      const now = new Date().toISOString()
      const newNotifs: Notification[] = activeContacts.map((contact) => {
        const message = `Security alert: ${userProfile.name}'s identity may be compromised.
Verified: ${formatShortTimestamp(userProfile.lastVerification)}
Affected Systems: ${compromisedSystems.join(", ")}
Do not trust communications from these systems.
Signed: ReclaimSystemSig` // Changed from ReclaimClientSig for system alerts
        return {
          notificationId: `notif_${Date.now()}_${contact.contactId}`,
          userId: userProfile.userId,
          contactId: contact.contactId,
          messageContent: message,
          sentAt: now,
          deliveryStatus: "pending",
          notificationType: "breach_alert", // Keep as breach_alert for now, or make dynamic
        }
      })

      setNotifications((prev) =>
        [...newNotifs, ...prev].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
      )
      await logActivity(
        alertType, // Use the passed alertType
        { count: newNotifs.length, systems: compromisedSystems },
        "ReclaimSystem", // Alerts come from the system
        now,
      )

      const contactIdsToUpdate = activeContacts.map((c) => c.contactId)
      setContacts((prev) =>
        prev.map((c) => (contactIdsToUpdate.includes(c.contactId) ? { ...c, lastNotified: now } : c)),
      )

      newNotifs.forEach((notif, index) => {
        setTimeout(
          () => {
            setNotifications((prevN) =>
              prevN.map((n) =>
                n.notificationId === notif.notificationId
                  ? { ...n, deliveryStatus: "sent", sentAt: new Date().toISOString() }
                  : n,
              ),
            )
            setTimeout(
              () => {
                const finalStatus = Math.random() > 0.2 ? "delivered" : "failed" // Higher chance of delivery
                setNotifications((prevN) =>
                  prevN.map((n) =>
                    n.notificationId === notif.notificationId
                      ? { ...n, deliveryStatus: finalStatus, sentAt: new Date().toISOString() }
                      : n,
                  ),
                )
                if (finalStatus === "delivered" && Math.random() > 0.4) {
                  // Higher chance of read
                  setTimeout(
                    () => {
                      setNotifications((prevN) =>
                        prevN.map((n) =>
                          n.notificationId === notif.notificationId
                            ? { ...n, deliveryStatus: "read", sentAt: new Date().toISOString() }
                            : n,
                        ),
                      )
                    },
                    2000 + Math.random() * 3000,
                  )
                }
              },
              1500 + Math.random() * 2000,
            )
          },
          500 * (index + 1), // Faster simulation
        )
      })
      setIsLoading(false)
    },
    [userProfile, contacts, logActivity],
  )

  const sendRecoveryMessage = useCallback(
    async (message: string, additionalContext?: string) => {
      if (!userProfile) {
        setError("User profile not loaded.")
        return
      }
      setIsLoading(true)
      const activeContacts = contacts.filter((c) => c.status === "active")
      if (activeContacts.length === 0) {
        setError("No active contacts to send recovery message to.")
        setIsLoading(false)
        return
      }

      const now = new Date().toISOString()
      const fullMessage = `${message}${additionalContext ? `\n\nContext: ${additionalContext}` : ""}`

      const newNotifs: Notification[] = activeContacts.map((contact) => ({
        notificationId: `notif_recmsg_${Date.now()}_${contact.contactId}`,
        userId: userProfile.userId,
        contactId: contact.contactId,
        messageContent: fullMessage,
        sentAt: now,
        deliveryStatus: "pending",
        notificationType: "recovery_update", // New type for specific recovery messages
      }))

      setNotifications((prev) =>
        [...newNotifs, ...prev].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
      )
      await logActivity(
        "recovery_message_composed",
        {
          count: newNotifs.length,
          messagePreview: message.substring(0, 50),
          hasAdditionalContext: !!additionalContext,
        },
        "UserAction",
        now,
      )
      // Simulate sending (similar to sendAlertsToContacts)
      newNotifs.forEach((notif, index) => {
        setTimeout(
          () => {
            setNotifications((prevN) =>
              prevN.map((n) => (n.notificationId === notif.notificationId ? { ...n, deliveryStatus: "sent" } : n)),
            )
            setTimeout(
              () => {
                setNotifications((prevN) =>
                  prevN.map((n) =>
                    n.notificationId === notif.notificationId ? { ...n, deliveryStatus: "delivered" } : n,
                  ),
                )
              },
              1000 + Math.random() * 1000,
            )
          },
          500 * (index + 1),
        )
      })

      setIsLoading(false)
      alert("Recovery message sent to active contacts.")
    },
    [userProfile, contacts, logActivity],
  )

  const initiateRecovery = useCallback(async () => {
    if (!userProfile) return
    setUserProfile((up) => (up ? { ...up, currentStatus: "recovering", recoveryStage: "alerting_contacts" } : null))
    await logActivity("recovery_initiated", { method: "user_action_or_system" })
    // Simulate moving to next stage after a delay
    setTimeout(async () => {
      setUserProfile((up) => (up ? { ...up, recoveryStage: "awaiting_social_verification" } : null))
      await logActivity("social_voting_initiated", {}, "System")
    }, 5000) // Simulate 5 seconds for alerts to "send"
  }, [userProfile, logActivity, setUserProfile])

  const completeRecovery = useCallback(async () => {
    if (!userProfile) return

    setUserProfile((up) =>
      up
        ? {
            ...up,
            currentStatus: "recovered",
            recoveryStage: null,
            lastVerification: new Date().toISOString(),
            breachTriggerDetails: undefined,
            reviewRequestDetails: undefined,
          }
        : null,
    )
    await logActivity("recovery_completed", { method: "simulated_social_consensus" })
  }, [userProfile, logActivity, setUserProfile])

  const flagSuspicionByContact = useCallback(
    async (contactId: string, reason: string) => {
      if (!userProfile) {
        setError("User profile not loaded.")
        return
      }
      const flaggingContact = contacts.find((c) => c.contactId === contactId)
      if (!flaggingContact) {
        setError(`Contact with ID ${contactId} not found.`)
        return
      }

      const triggerTimestamp = new Date().toISOString()
      const newBreachTriggerDetails: UserProfile["breachTriggerDetails"] = {
        type: "contact_flag",
        contactName: flaggingContact.name,
        reason: reason,
        timestamp: triggerTimestamp,
      }

      setUserProfile((up) =>
        up
          ? {
              ...up,
              currentStatus: "compromised",
              recoveryStage: null,
              breachTriggerDetails: newBreachTriggerDetails,
              reviewRequestDetails: undefined,
            }
          : null,
      )

      await logActivity(
        "contact_flagged_suspicion",
        {
          contactId: flaggingContact.contactId,
          contactName: flaggingContact.name,
          reason: reason,
        },
        "ContactInteraction",
        triggerTimestamp,
      )
      setError(null)
    },
    [userProfile, contacts, logActivity, setError, setUserProfile],
  )

  const simulateBreachByContactFlag = useCallback(async () => {
    if (!userProfile || contacts.length === 0) {
      setError("Cannot simulate breach: No user profile or no contacts.")
      return
    }
    const activeContacts = contacts.filter((c) => c.status === "active")
    if (activeContacts.length === 0) {
      setError("Cannot simulate breach: No active contacts.")
      return
    }
    const randomContact = activeContacts[Math.floor(Math.random() * activeContacts.length)]
    const randomReason = `Detected unusual activity on ${
      ["Social Media", "Email Account", "Banking App"][Math.floor(Math.random() * 3)]
    }.`

    await flagSuspicionByContact(randomContact.contactId, randomReason)
  }, [userProfile, contacts, setError, flagSuspicionByContact])

  const reportSuspicionByEmergencyContact = useCallback(
    async (reportedPlatforms: string[], description?: string, reportingContactId?: string) => {
      if (!userProfile) {
        setError("User profile not loaded. Cannot report suspicion.")
        return
      }
      setIsLoading(true)
      const reportTimestamp = new Date().toISOString()
      const reportingContact = contacts.find((c) => c.contactId === reportingContactId)

      const reviewDetails: ReviewRequestDetails = {
        reportingContactName: reportingContact?.name || "Emergency Contact",
        reportingContactId: reportingContactId,
        reportingContactRelationship: reportingContact?.relationship,
        reportedPlatforms,
        reportDescription: description,
        timestamp: reportTimestamp,
      }

      setUserProfile((up) =>
        up
          ? {
              ...up,
              currentStatus: "under_review",
              recoveryStage: null,
              reviewRequestDetails: reviewDetails,
              breachTriggerDetails: undefined,
            }
          : null,
      )

      await logActivity("suspicion_reported_by_contact", { ...reviewDetails }, "ContactReport", reportTimestamp)
      setIsLoading(false)
    },
    [userProfile, contacts, logActivity, setError, setIsLoading, setUserProfile],
  )

  const initiateSecurityReview = useCallback(async () => {
    if (!userProfile || userProfile.currentStatus !== "under_review") {
      setError("No active security review to initiate.")
      return
    }
    await logActivity("security_review_initiated", {
      reviewDetails: userProfile.reviewRequestDetails,
    })
  }, [userProfile, logActivity])

  const confirmCompromiseAfterReview = useCallback(async () => {
    if (!userProfile || !userProfile.reviewRequestDetails) {
      setError("Cannot confirm compromise: No review details found.")
      return
    }
    setIsLoading(true)
    const reviewDetails = userProfile.reviewRequestDetails
    const now = new Date().toISOString()

    await logActivity("security_review_identity_verified", { method: "video_passphrase" }, "UserAction", now)

    setUserProfile((up) =>
      up
        ? {
            ...up,
            currentStatus: "compromised", // Will be changed to 'recovering' by initiateRecovery
            recoveryStage: "alerting_contacts",
            breachTriggerDetails: {
              type: "user_confirmed_review",
              contactName: reviewDetails.reportingContactName,
              reason: reviewDetails.reportDescription || "User confirmed reported suspicion.",
              timestamp: now,
              reportedPlatforms: reviewDetails.reportedPlatforms,
            },
            lastVerification: now,
            reviewRequestDetails: undefined,
          }
        : null,
    )

    await logActivity(
      "security_review_compromise_confirmed",
      {
        originalReportTimestamp: reviewDetails.timestamp,
        reportedBy: reviewDetails.reportingContactName,
        platforms: reviewDetails.reportedPlatforms,
      },
      "UserAction",
      now,
    )

    await sendAlertsToContacts(
      reviewDetails.reportedPlatforms || ["Unknown System"],
      "recovery_alerts_sent_to_contacts",
    )
    await initiateRecovery() // This will set status to 'recovering' and stage to 'alerting_contacts'

    setIsLoading(false)
  }, [userProfile, logActivity, setIsLoading, setError, sendAlertsToContacts, initiateRecovery])

  const dismissAsFalseAlarm = useCallback(
    async (messageToContact?: string) => {
      if (!userProfile || !userProfile.reviewRequestDetails) {
        setError("Cannot dismiss: No review details found.")
        return
      }
      setIsLoading(true)
      const reviewDetails = userProfile.reviewRequestDetails
      const now = new Date().toISOString()

      setUserProfile((up) =>
        up
          ? {
              ...up,
              currentStatus: "safe",
              recoveryStage: null,
              reviewRequestDetails: undefined,
              lastVerification: now,
            }
          : null,
      )

      await logActivity(
        "security_review_false_alarm_dismissed",
        {
          originalReportTimestamp: reviewDetails.timestamp,
          reportedBy: reviewDetails.reportingContactName,
          messageSentToContact: !!messageToContact,
        },
        "UserAction",
        now,
      )

      if (reviewDetails.reportingContactId) {
        const reportingContact = contacts.find((c) => c.contactId === reviewDetails.reportingContactId)
        if (reportingContact && userProfile) {
          // Ensure userProfile is not null for name
          const notificationMessage = `The security concern you reported for ${userProfile.name} on ${formatShortTimestamp(reviewDetails.timestamp)} has been reviewed and resolved as a false alarm. ${messageToContact ? `Message from ${userProfile.name}: "${messageToContact}"` : ""} Thank you for your vigilance.`

          const newNotif: Notification = {
            notificationId: `notif_resolve_${Date.now()}_${reportingContact.contactId}`,
            userId: userProfile.userId,
            contactId: reportingContact.contactId,
            messageContent: notificationMessage,
            sentAt: now,
            deliveryStatus: "pending",
            notificationType: "review_resolution",
          }
          setNotifications((prev) =>
            [newNotif, ...prev].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
          )
          setTimeout(() => {
            setNotifications((prevNots) =>
              prevNots.map((n) =>
                n.notificationId === newNotif.notificationId ? { ...n, deliveryStatus: "sent" } : n,
              ),
            )
            setTimeout(() => {
              setNotifications((prevNots) =>
                prevNots.map((n) =>
                  n.notificationId === newNotif.notificationId ? { ...n, deliveryStatus: "delivered" } : n,
                ),
              )
            }, 2000)
          }, 1000)

          await logActivity(
            "security_review_contact_notified_of_resolution",
            {
              contactId: reportingContact.contactId,
              contactName: reportingContact.name,
              resolution: "false_alarm",
            },
            "System",
            now,
          )
        }
      }
      setIsLoading(false)
    },
    [userProfile, contacts, logActivity, setIsLoading, setError, setNotifications],
  )

  const resetSessionData = useCallback(() => {
    setIsLoading(true)
    const currentName = userProfile?.name === "New User" || !userProfile?.name ? "New User" : userProfile.name
    initializeSession(currentName)
    console.log("Session data has been reset.")
  }, [initializeSession, userProfile])

  const simulateContactRecoveryVotes = useCallback(() => {
    if (
      !userProfile ||
      userProfile.currentStatus !== "recovering" ||
      userProfile.recoveryStage !== "awaiting_social_verification"
    ) {
      console.warn("Cannot simulate votes: Not in correct recovery stage.")
      return
    }
    setIsLoading(true)
    const activeContacts = contacts.filter((c) => c.status === "active")
    let votesFor = 0
    const updatedContacts = contacts.map((c) => {
      if (c.status === "active") {
        const vote = Math.random() > 0.25 // 75% chance of voting yes
        if (vote) votesFor++
        return {
          ...c,
          recoveryVoteStatus: vote ? "approved" : "denied",
          recoveryVoteTimestamp: new Date(Date.now() + Math.random() * 1000 * 60 * 10).toISOString(), // Staggered votes
        } as Contact
      }
      return c
    })
    setContacts(updatedContacts)
    logActivity(
      "contact_vote_received",
      { simulated: true, votes: activeContacts.length, approved: votesFor },
      "SystemSimulation",
    )

    // Simulate moving to next stage after votes
    // In a real app, this would depend on threshold
    setTimeout(async () => {
      if (votesFor >= Math.ceil(activeContacts.length * 0.6)) {
        // Example: 60% threshold
        setUserProfile((up) => (up ? { ...up, recoveryStage: "finalizing" } : null))
        await logActivity(
          "social_voting_initiated",
          { status: "threshold_met", votesFor, totalActiveContacts: activeContacts.length },
          "System",
        )
        // Simulate finalization and completion
        setTimeout(async () => {
          await completeRecovery()
        }, 3000)
      } else {
        setUserProfile((up) => (up ? { ...up, recoveryStage: "awaiting_social_verification" } : null)) // Or a "failed_voting" stage
        await logActivity(
          "social_voting_initiated",
          { status: "threshold_not_met", votesFor, totalActiveContacts: activeContacts.length },
          "System",
        )
        setError("Recovery failed: Not enough contact verifications.")
      }
      setIsLoading(false)
    }, 2000) // Delay for votes to "come in"
  }, [userProfile, contacts, logActivity, completeRecovery, setIsLoading, setError, setUserProfile])

  return (
    <ReclaimContext.Provider
      value={{
        userProfile,
        contacts,
        activityLog,
        notifications,
        isLoading,
        error,
        initializeSession,
        addContactAndSendInvitation,
        updateContact,
        removeContact,
        logActivity,
        updateUserProfile,
        sendAlertsToContacts,
        initiateRecovery,
        completeRecovery,
        simulateBreachByContactFlag,
        flagSuspicionByContact,
        reportSuspicionByEmergencyContact,
        resendInvitation,
        simulateAcceptInvitation,
        checkAndExpireInvitations,
        resetSessionData,
        initiateSecurityReview,
        confirmCompromiseAfterReview,
        dismissAsFalseAlarm,
        sendRecoveryMessage,
        simulateContactRecoveryVotes,
      }}
    >
      {children}
    </ReclaimContext.Provider>
  )
}

export const useReclaim = () => {
  const context = useContext(ReclaimContext)
  if (context === undefined) {
    throw new Error("useReclaim must be used within a ReclaimProvider")
  }
  return context
}
