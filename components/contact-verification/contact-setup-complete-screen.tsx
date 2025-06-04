"use client"
import { Button } from "@/components/ui/button"
import ContactVerificationLayout from "./contact-verification-layout"
import { CheckCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"

interface ContactSetupCompleteScreenProps {
  userNameWhoInvited: string
  userCurrentStatus: string // e.g., "Currently Safe"
}

export default function ContactSetupCompleteScreen({
  userNameWhoInvited,
  userCurrentStatus,
}: ContactSetupCompleteScreenProps) {
  return (
    <ContactVerificationLayout headerText="Contact Active">
      <CheckCircle className="w-16 h-16 text-[#00A86B] mx-auto mb-6" />
      <p className="text-neutral-800 mb-2 text-lg">
        You are now an active emergency contact for <span className="font-semibold">{userNameWhoInvited}</span>.
      </p>
      <p className="text-neutral-700 mb-8 text-md">You'll be notified of important security events.</p>
      <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 mb-8 text-left">
        <p className="text-sm text-neutral-600">
          <span className="font-semibold">{userNameWhoInvited}</span>'s Status:
          <span className="ml-2 inline-flex items-center font-semibold text-[#00A86B]">
            <ShieldCheck className="w-4 h-4 mr-1" /> {userCurrentStatus}
          </span>
        </p>
      </div>
      <Link href="/contact-dashboard" passHref legacyBehavior>
        <Button asChild className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md">
          <a>Go to Contact Dashboard</a>
        </Button>
      </Link>
      <p className="text-xs text-neutral-500 mt-4">
        (Note: This dashboard view will be tailored for emergency contacts in a future update.)
      </p>
    </ContactVerificationLayout>
  )
}
