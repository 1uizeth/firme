"use client"
import { useState } from "react"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { useReclaim } from "@/contexts/reclaim-context"
import type { Contact as ReclaimContactType, ContactRelationship } from "@/lib/reclaim-types"

interface Step3EmergencyContactsProps {
  onComplete: () => void
  onBack?: () => void
  currentStep: number
  totalSteps: number
}

export default function Step3EmergencyContacts({ onComplete, onBack, currentStep, totalSteps }: Step3EmergencyContactsProps) {
  const {
    contacts: contextContacts,
    addContactAndSendInvitation, // Updated function name
    removeContact: removeContextContact,
    isLoading,
  } = useReclaim()

  const [name, setName] = useState("")
  const [contactMethod, setContactMethod] = useState("")
  // Default to 'email' or let user choose if UI is expanded
  // const [contactType, setContactType] = useState<ReclaimContactType["type"]>("email"); // Type is auto-detected now

  const handleAddContact = async () => {
    if (name.trim() && contactMethod.trim()) {
      let determinedType: ReclaimContactType["type"] = "other"
      if (contactMethod.includes("@")) {
        determinedType = "email"
      } else if (contactMethod.match(/^\+?[0-9\s-()]+$/)) {
        determinedType = "phone"
      }

      // Provide a default relationship for contacts added during onboarding
      const defaultRelationship: ContactRelationship = "Other"

      await addContactAndSendInvitation({
        name: name.trim(),
        contactMethod: contactMethod.trim(),
        type: determinedType,
        relationship: defaultRelationship, // Added default relationship
      })
      setName("")
      setContactMethod("")
    }
  }

  const handleRemoveContact = async (id: string) => {
    await removeContextContact(id)
  }

  return (
    <OnboardingLayout 
      stepNumber={currentStep} 
      totalSteps={totalSteps} 
      headerText="Add Emergency Contacts"
      onBack={onBack}
      showBackButton={true}
    >
      <p className="text-neutral-700 mb-6 text-lg">Add trusted contacts for recovery</p>

      <div className="space-y-4 mb-6 text-left">
        <Input
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
          aria-label="Contact Name"
        />
        <Input
          type="text"
          placeholder="Contact Method (e.g., email or phone)"
          value={contactMethod}
          onChange={(e) => setContactMethod(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
          aria-label="Contact Method"
        />
        <Button
          onClick={handleAddContact}
          variant="outline"
          className="w-full border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 rounded-md"
          aria-label="Add Contact"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> {isLoading ? "Adding..." : "Add Contact & Send Invite"}
        </Button>
      </div>

      {contextContacts.length > 0 && (
        <div className="mb-8 space-y-2 text-left">
          <h3 className="font-semibold text-neutral-800">Trusted Contacts:</h3>
          <ul className="list-none p-0">
            {contextContacts.map((contact) => (
              <li key={contact.contactId} className="flex justify-between items-center p-2 border-b border-neutral-200">
                <span className="text-sm text-neutral-700">
                  {contact.name} -{" "}
                  <span className="font-mono text-xs">
                    {contact.contactMethod} ({contact.type})
                  </span>
                  {contact.status === "pending_invitation" && (
                    <span className="ml-2 text-xs text-blue-600">(Invitation Pending)</span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContact(contact.contactId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                  aria-label={`Remove ${contact.name}`}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        onClick={onComplete}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        disabled={
          contextContacts.filter((c) => c.status === "active" || c.status === "pending_invitation").length === 0 ||
          isLoading
        }
        aria-label="Complete setup and continue"
      >
        Continue
      </Button>
      <p className="text-xs text-neutral-500 mt-2">
        Contacts will receive an invitation to join your network. You need at least one contact with a pending or active
        invitation to continue.
      </p>
    </OnboardingLayout>
  )
}
