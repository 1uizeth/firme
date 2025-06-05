"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ShieldQuestion } from "lucide-react"
import Link from "next/link"

interface SubmissionCompleteStepProps {
  monitoredUserName: string
}

export default function SubmissionCompleteStep({ monitoredUserName }: SubmissionCompleteStepProps) {
  return (
    <div className="text-center">
      <CheckCircle className="w-16 h-16 text-[#00A86B] mx-auto mb-6" />
      <p className="text-neutral-800 mb-2 text-lg">
        Your report concerning <span className="font-semibold">{monitoredUserName}</span> has been submitted.
      </p>
      <p className="text-neutral-700 mb-6 text-md">
        Their account status has been updated to:
        <span className="ml-2 inline-flex items-center font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
          <ShieldQuestion className="w-4 h-4 mr-1" /> Under Review
        </span>
      </p>
      <p className="text-sm text-neutral-600 mb-8">
        {monitoredUserName} has been notified. You will be updated if further verification from your end is required.
      </p>
      <Link href="/contact-dashboard" passHref legacyBehavior>
        <Button asChild className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md">
          <a>Return to Contact Dashboard</a>
        </Button>
      </Link>
    </div>
  )
}
