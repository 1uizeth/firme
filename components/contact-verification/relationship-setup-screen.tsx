"use client"
import { Button } from "@/components/ui/button"
import ContactVerificationLayout from "./contact-verification-layout"

interface RelationshipSetupScreenProps {
  userNameWhoInvited: string
  onRelationshipSet: (relationship: string) => void
}

const relationshipOptions = ["Family", "Friend", "Colleague", "Other"]

export default function RelationshipSetupScreen({
  userNameWhoInvited,
  onRelationshipSet,
}: RelationshipSetupScreenProps) {
  return (
    <ContactVerificationLayout headerText="Relationship">
      <p className="text-neutral-700 mb-8 text-lg">
        What is your relationship to <span className="font-semibold">{userNameWhoInvited}</span>?
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {relationshipOptions.map((option) => (
          <Button
            key={option}
            variant="outline"
            onClick={() => onRelationshipSet(option)}
            className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-[#00A86B] py-3 text-md rounded-md focus:bg-[#00A86B]/10 focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]"
          >
            {option}
          </Button>
        ))}
      </div>
      <p className="text-xs text-neutral-500">This information is used for verification confidence scoring.</p>
    </ContactVerificationLayout>
  )
}
