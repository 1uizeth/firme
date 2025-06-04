import { CheckCircle, Loader2, CircleDotDashed } from "lucide-react"
import type { UserProfile } from "@/lib/reclaim-types"

interface RecoveryTimelineDisplayProps {
  currentStage: UserProfile["recoveryStage"] | "alerting_contacts" // Use "alerting_contacts" as initial if stage is null
}

const stages = [
  { id: "identity_verified", label: "Identity Verified", stageProp: null }, // This is pre-recovery start
  { id: "alerting_contacts", label: "Contacts Alerted", stageProp: "alerting_contacts" },
  { id: "awaiting_social_verification", label: "Social Verification", stageProp: "awaiting_social_verification" },
  { id: "finalizing", label: "Finalizing Recovery", stageProp: "finalizing" },
  { id: "recovery_complete", label: "Recovery Complete", stageProp: null }, // Post-recovery
] as const

type StageId = (typeof stages)[number]["id"]

const getStageStatus = (
  stageId: StageId,
  currentActualStage: UserProfile["recoveryStage"] | "alerting_contacts",
): "completed" | "in_progress" | "pending" => {
  const stageIndex = stages.findIndex((s) => s.id === stageId)
  // Find current actual stage index. 'alerting_contacts' is effectively the first active stage.
  const currentActualStageIndex = stages.findIndex(
    (s) =>
      s.stageProp === currentActualStage ||
      (s.id === "alerting_contacts" && currentActualStage === "alerting_contacts"),
  )

  if (stageId === "identity_verified") return "completed" // Always completed to start recovery

  if (stageIndex < currentActualStageIndex) return "completed"
  if (stageIndex === currentActualStageIndex) return "in_progress"
  return "pending"
}

export default function RecoveryTimelineDisplay({ currentStage }: RecoveryTimelineDisplayProps) {
  return (
    <section aria-labelledby="recovery-timeline-heading">
      <h2 id="recovery-timeline-heading" className="text-xl font-semibold text-black mb-4 text-center">
        Recovery Timeline
      </h2>
      <ol className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {stages.map((stage, index) => {
          if (stage.id === "identity_verified" || stage.id === "recovery_complete") return null // These are boundary states, not active steps in this timeline view

          const status = getStageStatus(stage.id, currentStage)
          let Icon = CircleDotDashed
          let iconColor = "text-neutral-400"
          let textColor = "text-neutral-500"

          if (status === "completed") {
            Icon = CheckCircle
            iconColor = "text-green-500"
            textColor = "text-green-700"
          } else if (status === "in_progress") {
            Icon = Loader2
            iconColor = "text-blue-500 animate-spin"
            textColor = "text-blue-600 font-semibold"
          }

          return (
            <li key={stage.id} className="flex-1 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-full">
                {index > 1 && (
                  <div className="flex-1 border-t-2 border-neutral-200 border-dashed mx-2 hidden sm:block"></div>
                )}
                <Icon className={`w-8 h-8 mb-1 sm:mb-2 ${iconColor}`} />
                {index < stages.length - 2 && (
                  <div className="flex-1 border-t-2 border-neutral-200 border-dashed mx-2 hidden sm:block"></div>
                )}
              </div>
              <p className={`text-xs sm:text-sm font-medium ${textColor}`}>{stage.label}</p>
            </li>
          )
        })}
      </ol>
      <p className="text-center text-xs text-neutral-500 mt-3">
        <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" /> Identity Verified (Pre-step)
      </p>
    </section>
  )
}
