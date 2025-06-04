"use client"
import { Button } from "@/components/ui/button"
import ContactVerificationLayout from "./contact-verification-layout"
import { CheckCircle, ShieldCheck, UserPlus, AlertTriangle } from "lucide-react"

interface InvitationConfirmedScreenProps {
  userNameWhoInvited: string
  onAcceptRole: () => void
}

export default function InvitationConfirmedScreen({
  userNameWhoInvited,
  onAcceptRole,
}: InvitationConfirmedScreenProps) {
  return (
    <ContactVerificationLayout headerText="Invitation Verified">
      <CheckCircle className="w-16 h-16 text-[#00A86B] mx-auto mb-6" />
      <p className="text-neutral-800 mb-6 text-lg">
        <span className="font-semibold">{userNameWhoInvited}</span> has added you to their security network.
      </p>
      <div className="text-left space-y-4 bg-neutral-50 p-6 rounded-md border border-neutral-200 mb-8">
        <h3 className="text-md font-semibold text-black mb-3">As an emergency contact, you will:</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-[#00A86B] mr-3 mt-0.5 shrink-0" />
            <span className="text-neutral-700 text-sm">
              Receive security alerts if {userNameWhoInvited}'s account is compromised.
            </span>
          </li>
          <li className="flex items-start">
            <UserPlus className="w-5 h-5 text-[#00A86B] mr-3 mt-0.5 shrink-0" />
            <span className="text-neutral-700 text-sm">
              Help verify {userNameWhoInvited}'s identity during account recovery.
            </span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="w-5 h-5 text-[#00A86B] mr-3 mt-0.5 shrink-0" />
            <span className="text-neutral-700 text-sm">Be able to report suspicious activity you observe.</span>
          </li>
        </ul>
      </div>
      <Button
        onClick={onAcceptRole}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
      >
        Accept Role & Continue
      </Button>
    </ContactVerificationLayout>
  )
}
