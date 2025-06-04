"use client"

import { Button } from "@/components/ui/button"
import { LifeBuoy } from "lucide-react" // MessageSquarePlus for adding message

interface RecoveryActionsProps {
  // onAddEmergencyMessage: () => void; // Covered by composer now
  onContactSupport: () => void
}

export default function RecoveryActions({ onContactSupport }: RecoveryActionsProps) {
  return (
    <section aria-labelledby="immediate-actions-heading" className="text-center">
      <h2 id="immediate-actions-heading" className="sr-only">
        Immediate Actions
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
        {/* Primary action is implicitly sending alerts via the status display and message composer */}
        {/* <Button
          // onClick={onAddEmergencyMessage} // This functionality is now part of the composer
          variant="outline"
          className="w-full sm:w-auto border-neutral-400 text-neutral-700 hover:bg-neutral-100"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" /> Add/Edit Recovery Message
        </Button> */}
        <Button
          onClick={onContactSupport}
          variant="outline"
          className="w-full sm:w-auto border-neutral-400 text-neutral-700 hover:bg-neutral-100"
        >
          <LifeBuoy className="mr-2 h-4 w-4" /> Contact Reclaim Support
        </Button>
      </div>
    </section>
  )
}
