"use client"
import { Button } from "@/components/ui/button"
import ContactVerificationLayout from "./contact-verification-layout"

interface ContactAuthenticationScreenProps {
  userNameWhoInvited: string
  onAuthenticated: () => void
}

export default function ContactAuthenticationScreen({
  userNameWhoInvited,
  onAuthenticated,
}: ContactAuthenticationScreenProps) {
  // Mock Civic authentication
  const handleCivicAuth = () => {
    alert("Simulating Civic Authentication... Success!")
    // In a real app, this would involve the Civic SDK
    // and on successful authentication, call onAuthenticated()
    onAuthenticated()
  }

  return (
    <ContactVerificationLayout headerText="Authenticate">
      <p className="text-neutral-700 mb-6 text-lg">
        Connect your identity to join {userNameWhoInvited}'s security network.
      </p>
      <Button
        onClick={handleCivicAuth}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md mb-4"
        aria-label="Connect identity with Civic"
      >
        Connect Identity with Civic
      </Button>
      <p className="text-xs text-neutral-500">Authentication is required for verified emergency contact status.</p>
    </ContactVerificationLayout>
  )
}
