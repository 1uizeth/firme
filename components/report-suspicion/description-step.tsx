"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DescriptionStepProps {
  onDescriptionSubmitted: (description: string) => void
  initialDescription?: string
}

const MAX_CHARS = 500

export default function DescriptionStep({ onDescriptionSubmitted, initialDescription = "" }: DescriptionStepProps) {
  const [description, setDescription] = useState(initialDescription)

  const charsLeft = MAX_CHARS - description.length

  return (
    <div>
      <p className="text-neutral-700 mb-4 text-lg text-center">Describe the suspicious behavior (optional).</p>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Example: Strange messages asking for money, unusual posts, account behavior changes..."
        className="min-h-[120px] border-neutral-300 focus:border-[#00A86B] mb-2"
        maxLength={MAX_CHARS}
      />
      <p className={`text-xs mb-6 text-right ${charsLeft < 0 ? "text-red-500" : "text-neutral-500"}`}>
        {charsLeft} characters remaining
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => onDescriptionSubmitted("")} // Allow skipping
          variant="outline"
          className="w-full sm:w-auto border-neutral-300 text-neutral-700 hover:bg-neutral-100"
        >
          Skip & Review
        </Button>
        <Button
          onClick={() => onDescriptionSubmitted(description)}
          className="w-full sm:flex-1 bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        >
          Next: Review Report
        </Button>
      </div>
    </div>
  )
}
