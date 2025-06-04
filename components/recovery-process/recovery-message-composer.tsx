"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, AlertTriangle } from "lucide-react"

interface RecoveryMessageComposerProps {
  compromisedPlatforms: string[]
  onSendMessage: (message: string, additionalContext?: string) => Promise<void>
  isLoading: boolean
}

const MAX_MESSAGE_CHARS = 500
const MAX_CONTEXT_CHARS = 200

export default function RecoveryMessageComposer({
  compromisedPlatforms,
  onSendMessage,
  isLoading,
}: RecoveryMessageComposerProps) {
  const prefilledMessage = `My digital identity has been compromised. I've verified this through Reclaim's secure system. Please ignore any messages from my ${compromisedPlatforms.join(
    ", ",
  )} account(s) until I confirm recovery is complete.`

  const [message, setMessage] = useState(prefilledMessage.slice(0, MAX_MESSAGE_CHARS))
  const [additionalContext, setAdditionalContext] = useState("")

  const messageCharsLeft = MAX_MESSAGE_CHARS - message.length
  const contextCharsLeft = MAX_CONTEXT_CHARS - additionalContext.length

  const platformWarnings = compromisedPlatforms.map((platform) => `Be cautious of messages from ${platform}.`).join(" ")

  const handleSend = async () => {
    if (!message.trim()) {
      alert("Main message cannot be empty.")
      return
    }
    await onSendMessage(message, additionalContext.trim() || undefined)
    // Optionally clear fields after sending, or show a success message
    // setMessage(prefilledMessage.slice(0, MAX_MESSAGE_CHARS));
    // setAdditionalContext("");
  }

  return (
    <section aria-labelledby="recovery-message-heading">
      <h2 id="recovery-message-heading" className="text-xl font-semibold text-black mb-4 text-center">
        Compose Recovery Message (Optional)
      </h2>
      <p className="text-sm text-neutral-600 mb-4 text-center">
        You can send an additional message to your alerted contacts.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="recoveryMessage" className="block text-sm font-medium text-neutral-700 mb-1">
            Main Message to Contacts
          </Label>
          <Textarea
            id="recoveryMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_CHARS))}
            className="min-h-[100px] border-neutral-300 focus:border-[#00A86B]"
            maxLength={MAX_MESSAGE_CHARS}
          />
          <p className={`text-xs mt-1 text-right ${messageCharsLeft < 0 ? "text-red-500" : "text-neutral-500"}`}>
            {messageCharsLeft} characters remaining
          </p>
        </div>

        <div>
          <Label htmlFor="additionalContext" className="block text-sm font-medium text-neutral-700 mb-1">
            Add Personal Details (Optional - Contacts will recognize this)
          </Label>
          <Textarea
            id="additionalContext"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value.slice(0, MAX_CONTEXT_CHARS))}
            placeholder="e.g., 'Remember that trip to the lake? Call me on mom's phone if you need to verify.'"
            className="min-h-[60px] border-neutral-300 focus:border-[#00A86B]"
            maxLength={MAX_CONTEXT_CHARS}
          />
          <p className={`text-xs mt-1 text-right ${contextCharsLeft < 0 ? "text-red-500" : "text-neutral-500"}`}>
            {contextCharsLeft} characters remaining
          </p>
        </div>

        {platformWarnings && (
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{platformWarnings}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSend}
          className="w-full sm:w-auto bg-[#00A86B] hover:bg-[#008F5B] text-white py-2.5 px-6 rounded-md"
          disabled={isLoading || !message.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Send Message to Contacts"}
        </Button>
      </div>
    </section>
  )
}
