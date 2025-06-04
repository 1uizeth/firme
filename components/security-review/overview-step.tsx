"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, ShieldAlert, Info } from "lucide-react"
import type { ReviewRequestDetails } from "@/lib/reclaim-types"
import { formatDisplayTimestamp } from "@/lib/reclaim-types"

interface OverviewStepProps {
  reviewDetails: ReviewRequestDetails
  userName: string
  onConfirmCompromise: () => void
  onFalseAlarm: (messageToContact?: string) => void // Updated to accept optional message
  isSubmitting: boolean
}

export default function OverviewStep({
  reviewDetails,
  userName,
  onConfirmCompromise,
  onFalseAlarm,
  isSubmitting,
}: OverviewStepProps) {
  const {
    reportingContactName,
    reportingContactRelationship,
    reportedPlatforms,
    reportDescription,
    timestamp: reportTimestamp,
  } = reviewDetails

  return (
    <div className="space-y-6">
      <section className="text-center">
        <Info className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-black">Review Security Concern</h2>
        <p className="text-neutral-600">
          An emergency contact has reported suspicious activity related to your account.
        </p>
      </section>

      <Separator />

      <section className="p-4 border border-neutral-200 rounded-md bg-neutral-50 space-y-3">
        <h3 className="text-lg font-semibold text-black">Alert Details</h3>
        <div>
          <p className="text-sm font-medium text-neutral-500">Reported by:</p>
          <p className="text-neutral-700">
            {reportingContactName || "Unknown Contact"}
            {reportingContactRelationship && ` (${reportingContactRelationship})`}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Reported At:</p>
          <p className="text-neutral-700 font-mono text-sm">{formatDisplayTimestamp(reportTimestamp)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Flagged Platform(s):</p>
          <p className="text-neutral-700">{reportedPlatforms.join(", ") || "Not specified"}</p>
        </div>
        {reportDescription && (
          <div>
            <p className="text-sm font-medium text-neutral-500">Contact's Description:</p>
            <blockquote className="mt-1 p-3 bg-white border-l-4 border-neutral-300 text-neutral-700 text-sm italic">
              {reportDescription}
            </blockquote>
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-black text-center">What happened?</h3>

        {/* Confirm Compromise Button */}
        <div className="p-4 border border-red-300 rounded-md bg-red-50/50">
          <div className="flex items-start">
            <ShieldAlert className="h-6 w-6 text-red-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-700">My account was compromised.</h4>
              <p className="text-sm text-red-600 mb-3">
                This will trigger identity verification and alert your emergency contacts.
              </p>
              <Button
                onClick={onConfirmCompromise}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
                aria-describedby="confirm-compromise-desc"
              >
                Confirm Compromise
              </Button>
            </div>
          </div>
        </div>

        {/* False Alarm Button */}
        <div className="p-4 border border-neutral-300 rounded-md">
          <div className="flex items-start">
            <ShieldCheck className="h-6 w-6 text-green-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-700">This was a false alarm.</h4>
              <p className="text-sm text-neutral-600 mb-3">
                This will dismiss the review and notify the contact who reported it. Your account will remain secure.
              </p>
              <Button
                onClick={() => onFalseAlarm()} // For now, not prompting for message here
                variant="outline"
                className="w-full sm:w-auto border-neutral-400 hover:bg-neutral-100"
                disabled={isSubmitting}
                aria-describedby="false-alarm-desc"
              >
                It's a False Alarm
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
