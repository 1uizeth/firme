"use client"
import type { Contact, UserProfile } from "@/lib/reclaim-types"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react" // Zap for simulate

interface RecoveryProgressTrackerProps {
  contacts: Contact[]
  currentStage: UserProfile["recoveryStage"] | "alerting_contacts"
  onSimulateVotes: () => void // For demo
  onCompleteRecovery: () => void // For demo
}

export default function RecoveryProgressTracker({
  contacts,
  currentStage,
  onSimulateVotes,
  onCompleteRecovery,
}: RecoveryProgressTrackerProps) {
  const totalActiveContacts = contacts.length
  const respondedContacts = contacts.filter((c) => c.recoveryVoteStatus && c.recoveryVoteStatus !== "pending").length
  const approvedContacts = contacts.filter((c) => c.recoveryVoteStatus === "approved").length

  // Simulated confidence
  const recoveryConfidence =
    totalActiveContacts > 0 ? Math.min(100, Math.round((approvedContacts / totalActiveContacts) * 100 + 20)) : 20 // Base 20% confidence

  let nextMilestone = "Awaiting contact alert delivery..."
  if (currentStage === "awaiting_social_verification") {
    nextMilestone = "Awaiting contact verification responses."
  } else if (currentStage === "finalizing") {
    nextMilestone = "Finalizing account security and access."
  } else if (currentStage === null && recoveryConfidence === 100) {
    // This case might not be hit if currentStage becomes null only on 'recovered'
    nextMilestone = "Recovery process complete."
  }

  return (
    <section aria-labelledby="recovery-tracking-heading">
      <h2 id="recovery-tracking-heading" className="text-xl font-semibold text-black mb-4 text-center">
        Recovery Progress
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-500 font-medium mb-1">Expected Timeline</p>
          <p className="text-lg font-semibold text-black">2-6 Hours</p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-500 font-medium mb-1">Next Milestone</p>
          <p className="text-sm font-semibold text-black">{nextMilestone}</p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-500 font-medium mb-1">Contact Responses</p>
          <p className="text-lg font-semibold text-black">
            {respondedContacts} of {totalActiveContacts}
          </p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 sm:col-span-2 md:col-span-1">
          <p className="text-xs text-neutral-500 font-medium mb-1">Recovery Confidence</p>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${recoveryConfidence}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-600 mt-1">{recoveryConfidence}%</p>
        </div>
        {/* Demo buttons */}
        {currentStage === "awaiting_social_verification" && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 md:col-span-2 flex flex-col items-center justify-center">
            <Button
              onClick={onSimulateVotes}
              size="sm"
              variant="outline"
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
            >
              <Zap className="w-4 h-4 mr-2" /> Simulate Contact Votes (Dev)
            </Button>
            <p className="text-xs text-yellow-600 mt-1">For demonstration purposes.</p>
          </div>
        )}
        {currentStage === "finalizing" && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 md:col-span-2 flex flex-col items-center justify-center">
            <Button
              onClick={onCompleteRecovery}
              size="sm"
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-100"
            >
              <Check className="w-4 h-4 mr-2" /> Simulate Completion (Dev)
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
