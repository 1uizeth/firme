"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Added Select
import {
  PlusCircle,
  Edit3,
  Trash2,
  User,
  AtSign,
  Phone,
  ArrowLeft,
  AlertTriangle,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useReclaim } from "@/contexts/reclaim-context"
import type { Contact as ReclaimContactType, ContactRelationship } from "@/lib/reclaim-types"
import { formatDisplayTimestamp } from "@/lib/utils"

const relationshipOptions: ContactRelationship[] = ["Family", "Friend", "Colleague", "Other"]

export default function ManageContactsPage() {
  const {
    contacts: contextContacts,
    addContactAndSendInvitation,
    updateContact,
    removeContact,
    resendInvitation,
    simulateAcceptInvitation, // For demo purposes
    isLoading,
    error,
    checkAndExpireInvitations,
  } = useReclaim()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEditingContactId, setCurrentEditingContactId] = useState<string | null>(null)

  const [nameInput, setNameInput] = useState("")
  const [contactMethodInput, setContactMethodInput] = useState("")
  const [contactTypeInput, setContactTypeInput] = useState<ReclaimContactType["type"]>("email")
  const [relationshipInput, setRelationshipInput] = useState<ContactRelationship>("Friend")

  // Run expiry check on mount
  useEffect(() => {
    checkAndExpireInvitations()
  }, [checkAndExpireInvitations])

  const openDialogForAdd = () => {
    setCurrentEditingContactId(null)
    setNameInput("")
    setContactMethodInput("")
    setContactTypeInput("email")
    setRelationshipInput("Friend")
    setIsDialogOpen(true)
  }

  const openDialogForEdit = (contact: ReclaimContactType) => {
    setCurrentEditingContactId(contact.contactId)
    setNameInput(contact.name)
    setContactMethodInput(contact.contactMethod)
    setContactTypeInput(contact.type)
    setRelationshipInput(contact.relationship)
    setIsDialogOpen(true)
  }

  const handleSaveContact = async () => {
    if (!nameInput.trim() || !contactMethodInput.trim()) {
      alert("Name and Contact Method are required.")
      return
    }
    // Basic email/phone validation (can be improved)
    if (contactTypeInput === "email" && !contactMethodInput.includes("@")) {
      alert("Please enter a valid email address.")
      return
    }
    if (contactTypeInput === "phone" && !/^\+?[0-9\s-()]{7,}$/.test(contactMethodInput)) {
      alert("Please enter a valid phone number.")
      return
    }

    const contactData = {
      name: nameInput.trim(),
      contactMethod: contactMethodInput.trim(),
      type: contactTypeInput,
      relationship: relationshipInput,
    }

    if (currentEditingContactId) {
      await updateContact(currentEditingContactId, contactData)
    } else {
      await addContactAndSendInvitation(contactData)
    }
    setIsDialogOpen(false)
  }

  const handleDeleteContact = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this contact? This action cannot be undone.")) {
      await removeContact(id)
    }
  }

  const handleResendInvitation = async (contactId: string) => {
    if (window.confirm("Are you sure you want to resend the invitation to this contact?")) {
      await resendInvitation(contactId)
    }
  }

  const getContactIcon = (type: ReclaimContactType["type"]) => {
    switch (type) {
      case "email":
        return <AtSign className="h-4 w-4 text-neutral-500 mr-2 shrink-0" />
      case "phone":
        return <Phone className="h-4 w-4 text-neutral-500 mr-2 shrink-0" />
      default:
        return <User className="h-4 w-4 text-neutral-500 mr-2 shrink-0" />
    }
  }

  const getStatusBadge = (contact: ReclaimContactType) => {
    const now = new Date()
    const isExpired = contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < now

    if (contact.status === "pending_invitation") {
      if (isExpired) {
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 inline-flex items-center">
            <Clock className="h-3 w-3 mr-1" /> Expired
          </span>
        )
      }
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center">
          <Send className="h-3 w-3 mr-1" /> Pending Invitation
        </span>
      )
    }
    if (contact.status === "active") {
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 inline-flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
        </span>
      )
    }
    // 'removed' status contacts are filtered out, but if they were shown:
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 inline-flex items-center">
        <XCircle className="h-3 w-3 mr-1" /> Inactive
      </span>
    )
  }

  const contactsToDisplay = contextContacts.filter((c) => c.status !== "removed")

  if (isLoading && contactsToDisplay.length === 0) {
    return <div className="container mx-auto max-w-3xl px-4 py-10 md:py-16 text-center">Loading contacts...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 md:py-16 text-center text-red-500">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <p>Error loading contacts: {error}</p>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="outline" className="mt-4">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button variant="ghost" size="icon" className="mr-2 text-neutral-600 hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-black">Manage Emergency Network</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialogForAdd} className="bg-[#00A86B] hover:bg-[#008F5B] text-white rounded-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">
                {currentEditingContactId ? "Edit Contact" : "Add New Emergency Contact"}
              </DialogTitle>
              <DialogDescription>
                {currentEditingContactId
                  ? "Update the details for this emergency contact."
                  : "Enter details to invite a new emergency contact."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-neutral-700">
                  Name
                </Label>
                <Input
                  id="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="border-neutral-300 focus:border-[#00A86B]"
                  placeholder="e.g., Jane Doe"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contactMethod" className="text-neutral-700">
                  Contact Method (Email or Phone)
                </Label>
                <Input
                  id="contactMethod"
                  value={contactMethodInput}
                  onChange={(e) => {
                    setContactMethodInput(e.target.value)
                    // Auto-detect type (simple heuristic)
                    if (e.target.value.includes("@")) setContactTypeInput("email")
                    else if (e.target.value.match(/^\+?[0-9\s-()]+$/)) setContactTypeInput("phone")
                    else setContactTypeInput("other")
                  }}
                  className="border-neutral-300 focus:border-[#00A86B]"
                  placeholder="e.g., jane@example.com or +15551234567"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="relationship" className="text-neutral-700">
                  Relationship
                </Label>
                <Select
                  value={relationshipInput}
                  onValueChange={(value) => setRelationshipInput(value as ContactRelationship)}
                >
                  <SelectTrigger className="w-full border-neutral-300 focus:border-[#00A86B]">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-md"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSaveContact}
                className="bg-[#00A86B] hover:bg-[#008F5B] text-white rounded-md"
                disabled={isLoading}
              >
                {isLoading
                  ? currentEditingContactId
                    ? "Saving..."
                    : "Sending..."
                  : currentEditingContactId
                    ? "Save Changes"
                    : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Separator className="mb-8 bg-neutral-200" />

      {contactsToDisplay.length > 0 ? (
        <div className="space-y-3">
          {contactsToDisplay.map((contact) => {
            const now = new Date() // Define now here
            const isExpired = contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < now
            return (
              <div key={contact.contactId} className="p-4 border border-neutral-200 rounded-lg bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    {getContactIcon(contact.type)}
                    <div>
                      <p className="text-md font-semibold text-black">{contact.name}</p>
                      <p className="text-sm text-neutral-600 font-mono">{contact.contactMethod}</p>
                      <p className="text-xs text-neutral-500">Relationship: {contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end space-y-1 sm:space-y-0 sm:space-x-2">
                    {getStatusBadge(contact)}
                    <p className="text-xs text-neutral-500 font-mono">
                      Added: {formatDisplayTimestamp(contact.addedAt)}
                    </p>
                    {contact.status === "pending_invitation" && contact.invitationSentAt && (
                      <p className="text-xs text-neutral-500 font-mono">
                        Invited: {formatDisplayTimestamp(contact.invitationSentAt)}
                        {contact.invitationExpiresAt &&
                          new Date(contact.invitationExpiresAt) > new Date() &&
                          ` (Expires: ${formatDisplayTimestamp(contact.invitationExpiresAt)})`}
                      </p>
                    )}
                    {contact.status === "active" && contact.invitationAcceptedAt && (
                      <p className="text-xs text-neutral-500 font-mono">
                        Joined: {formatDisplayTimestamp(contact.invitationAcceptedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Separator className="my-3 bg-neutral-100" />
                <div className="flex items-center justify-end space-x-2">
                  {contact.status === "pending_invitation" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvitation(contact.contactId)}
                      className="text-xs border-blue-500 text-blue-600 hover:bg-blue-50"
                      disabled={
                        isLoading || (contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < new Date())
                      }
                      title={
                        contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < new Date()
                          ? "Invitation Expired"
                          : "Resend Invitation"
                      }
                    >
                      <RefreshCw className="h-3 w-3 mr-1" /> Resend
                    </Button>
                  )}
                  {/* Demo button to simulate contact accepting */}
                  {contact.status === "pending_invitation" &&
                    !(contact.invitationExpiresAt && new Date(contact.invitationExpiresAt) < new Date()) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => simulateAcceptInvitation(contact.contactId)}
                        className="text-xs border-green-500 text-green-600 hover:bg-green-50"
                        disabled={isLoading || isExpired}
                        title={isExpired ? "Invitation Expired" : "Simulate Contact Accepting Invitation"}
                      >
                        Simulate Accept
                      </Button>
                    )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialogForEdit(contact)}
                    className="text-xs text-neutral-600 hover:text-[#00A86B] hover:bg-[#00A86B]/10"
                    aria-label={`Edit ${contact.name}`}
                    disabled={isLoading || contact.status === "pending_invitation"}
                    title={
                      contact.status === "pending_invitation" ? "Cannot edit pending contact" : `Edit ${contact.name}`
                    }
                  >
                    <Edit3 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteContact(contact.contactId)}
                    className="text-xs text-neutral-600 hover:text-red-600 hover:bg-red-600/10"
                    aria-label={`Remove ${contact.name}`}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-lg">
          <Users className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-neutral-500 text-md">No emergency contacts configured.</p>
          <p className="text-sm text-neutral-400 mt-1">Click "Add Contact" to send an invitation.</p>
        </div>
      )}
      <Separator className="mt-12 bg-neutral-200" />
      <footer className="text-center py-6 mt-4">
        <p className="font-mono text-xs text-neutral-400">Reclaim Contact Management</p>
      </footer>
    </div>
  )
}
