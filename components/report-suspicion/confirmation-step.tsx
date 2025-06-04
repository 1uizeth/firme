"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmationStepProps {
  monitoredUserName: string
  selectedPlatforms: string[]
  description: string
  onSubmit: () => void
  onEdit: () => void // To go back to previous steps
  onCancel: () => void
  isLoading: boolean
}

export default function ConfirmationStep({
  monitoredUserName,
  selectedPlatforms,
  description,
  onSubmit,
  onEdit,
  onCancel,
  isLoading,
}: ConfirmationStepProps) {
  return (
    <div className="text-left">
      <div className="space-y-3 mb-6">
        <div>
          <h3 className="font-semibold text-neutral-800">Reporting for:</h3>
          <p className="text-neutral-700">{monitoredUserName}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">Suspicious Platforms:</h3>
          <p className="text-neutral-700">{selectedPlatforms.join(", ")}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">Details:</h3>
          <p className="text-neutral-700 whitespace-pre-wrap break-words">
            {description.trim() || "No details provided."}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              Upon submission, <span className="font-semibold">{monitoredUserName}</span> will be notified, and their
              account status will be flagged for review.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row-reverse gap-3">
        <Button
          onClick={onSubmit}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-3 text-lg rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Report"}
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          className="w-full sm:w-auto border-neutral-300 text-neutral-700 hover:bg-neutral-100"
          disabled={isLoading}
        >
          Edit Report
        </Button>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="w-full sm:w-auto text-neutral-600 hover:bg-neutral-100 sm:mr-auto"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
