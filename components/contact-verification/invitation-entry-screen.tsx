"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ContactVerificationLayout from "./contact-verification-layout"

interface InvitationEntryScreenProps {
  onCodeVerified: (code: string) => void
  verifyCodeFunction: (code: string) => Promise<boolean>
}

export default function InvitationEntryScreen({ onCodeVerified, verifyCodeFunction }: InvitationEntryScreenProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError("Please enter a valid 6-digit code.")
      return
    }
    setIsLoading(true)
    setError(null)
    // The verifyCodeFunction is now modified to accept any 6-digit code for testing
    const isValid = await verifyCodeFunction(code)
    setIsLoading(false)
    if (isValid) {
      onCodeVerified(code)
    } else {
      // This branch should ideally not be hit if verifyCodeFunction always returns true for any 6-digit code
      setError("An unexpected error occurred during verification.")
    }
  }

  return (
    <ContactVerificationLayout headerText="Emergency Contact">
      <p className="text-neutral-700 mb-6 text-lg">You've been invited as a trusted contact.</p>
      <div className="space-y-4 mb-6">
        <Input
          type="text"
          value={code}
          onChange={(e) => {
            const inputValue = e.target.value.replace(/\D/g, "").slice(0, 6) // Allow only digits, max 6
            setCode(inputValue)
            if (inputValue.length === 6) {
              setError(null) // Clear error once 6 digits are entered
            }
          }}
          placeholder="Enter 6-digit code"
          className={`border-neutral-300 focus:border-[#00A86B] text-center text-2xl tracking-[0.3em] font-mono ${
            error ? "border-red-500 focus:border-red-600" : ""
          }`}
          aria-label="Invitation code"
          maxLength={6}
          pattern="\d{6}"
          inputMode="numeric"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-neutral-500">This code was sent to your registered email or phone.</p>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </ContactVerificationLayout>
  )
}
