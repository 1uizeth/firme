"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, ShieldCheck, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useReclaim } from "@/contexts/reclaim-context" // To call dismissAsFalseAlarm again with message

interface FalseAlarmScreenProps {
  userName: string
  reportingContactName: string
}

export default function FalseAlarmScreen({ userName, reportingContactName }: FalseAlarmScreenProps) {
  const [messageToContact, setMessageToContact] = useState("")
  const [messageSent, setMessageSent] = useState(false)
  const { dismissAsFalseAlarm, isLoading } = useReclaim() // Get dismissAsFalseAlarm from context

  const handleSendMessage = async () => {
    // This assumes dismissAsFalseAlarm can be called again to *just* send the message
    // Or, ideally, the initial call to dismissAsFalseAlarm would take this message.
    // For this structure, we'll re-call it, assuming it's idempotent for status change
    // but will send the notification if message is new.
    // This is a simplification; a better approach would be a dedicated "notifyContact" function.
    await dismissAsFalseAlarm(messageToContact)
    setMessageSent(true)
  }

  return (
    <div className="text-center space-y-6">
      <ShieldCheck className="w-16 h-16 text-green-600 mx-auto" />
      <h2 className="text-2xl font-semibold text-black">Review Dismissed as False Alarm</h2>
      <p className="text-neutral-700">Thank you for clarifying, {userName}. The security review has been closed.</p>

      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md text-left space-y-2">
        <h3 className="font-semibold text-black">Outcome:</h3>
        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
          <li>
            <span className="font-semibold">{reportingContactName}</span> will be notified that this was a false alarm.
          </li>
          <li>
            Your account status has been restored to: <span className="font-semibold text-green-600">Safe</span>.
          </li>
        </ul>
      </div>

      {!messageSent && (
        <div className="space-y-3 text-left">
          <Label htmlFor="messageToContact" className="font-medium text-neutral-700 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-neutral-500" /> Optional: Send a message to{" "}
            {reportingContactName}
          </Label>
          <Textarea
            id="messageToContact"
            value={messageToContact}
            onChange={(e) => setMessageToContact(e.target.value.slice(0, 200))}
            placeholder={`e.g., "Thanks for looking out! Everything is fine."`}
            className="min-h-[80px] border-neutral-300 focus:border-[#00A86B]"
            maxLength={200}
          />
          <div className="text-right">
            <Button
              onClick={handleSendMessage}
              variant="outline"
              size="sm"
              disabled={isLoading || !messageToContact.trim()}
              className="border-neutral-400"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      )}
      {messageSent && (
        <p className="text-sm text-green-600 p-2 bg-green-50 rounded-md">
          <CheckCircle className="inline w-4 h-4 mr-1" /> Message sent to {reportingContactName}.
        </p>
      )}

      <Link href="/dashboard" passHref legacyBehavior>
        <Button asChild className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md mt-4">
          <a>Return to Dashboard</a>
        </Button>
      </Link>
    </div>
  )
}
