"use client"

import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

interface CompromiseConfirmedScreenProps {
  userName: string
  reportedPlatforms?: string[]
}

export default function CompromiseConfirmedScreen({ userName, reportedPlatforms }: CompromiseConfirmedScreenProps) {
  return (
    <div className="text-center space-y-6">
      <ShieldAlert className="w-16 h-16 text-red-600 mx-auto" />
      <h2 className="text-2xl font-semibold text-black">Compromise Confirmed</h2>
      <p className="text-neutral-700">
        Thank you for verifying, {userName}. Your identity has been confirmed. We are now taking action to secure your
        account.
      </p>

      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md text-left space-y-2">
        <h3 className="font-semibold text-black">Next Steps:</h3>
        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
          <li>
            Your emergency contacts will be alerted about the confirmed compromise of{" "}
            {reportedPlatforms && reportedPlatforms.length > 0 ? reportedPlatforms.join(", ") : "your account(s)"}.
          </li>
          <li>
            Your account status has been updated to: <span className="font-semibold text-red-600">Recovering</span>.
          </li>
          <li>The account recovery process has been initiated.</li>
        </ul>
      </div>

      <p className="text-sm text-neutral-500">
        You will be guided through the necessary steps to regain full control and security.
      </p>

      <Link href="/recovery-process" passHref legacyBehavior>
        <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg rounded-md">
          <a>Continue to Recovery Process</a>
        </Button>
      </Link>
    </div>
  )
}
