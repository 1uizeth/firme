"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface PlatformSelectionStepProps {
  onPlatformsSelected: (platforms: string[]) => void
  initialSelectedPlatforms?: string[]
}

const platformOptions = [
  "WhatsApp",
  "Instagram",
  "Email",
  "Phone/SMS",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "Other social media",
  "Banking App",
  "Shopping Website",
  "Unknown/Other",
]

export default function PlatformSelectionStep({
  onPlatformsSelected,
  initialSelectedPlatforms = [],
}: PlatformSelectionStepProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialSelectedPlatforms)
  const [error, setError] = useState<string | null>(null)

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
    if (error) setError(null) // Clear error on selection change
  }

  const handleSubmit = () => {
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform.")
      return
    }
    setError(null)
    onPlatformsSelected(selectedPlatforms)
  }

  return (
    <div>
      <p className="text-neutral-700 mb-6 text-lg text-center">Which platforms are showing suspicious activity?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-left">
        {platformOptions.map((platform) => (
          <div
            key={platform}
            className="flex items-center space-x-2 p-2 border border-neutral-200 rounded-md hover:bg-neutral-50"
          >
            <Checkbox
              id={`platform-${platform.toLowerCase().replace(/\s|\//g, "-")}`}
              checked={selectedPlatforms.includes(platform)}
              onCheckedChange={() => handlePlatformToggle(platform)}
              className="border-neutral-400 data-[state=checked]:bg-[#00A86B] data-[state=checked]:border-[#00A86B]"
            />
            <Label
              htmlFor={`platform-${platform.toLowerCase().replace(/\s|\//g, "-")}`}
              className="text-sm font-medium text-neutral-800 cursor-pointer flex-1"
            >
              {platform}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
      <Button
        onClick={handleSubmit}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        disabled={selectedPlatforms.length === 0}
      >
        Next: Add Details
      </Button>
    </div>
  )
}
