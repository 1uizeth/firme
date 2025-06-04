"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ShieldCheck } from "lucide-react"

interface AccountSecurityGuidanceProps {
  onLogAction: (action: string) => void
}

const guidanceItems = [
  { id: "change_passwords", label: "Change passwords on uncompromised accounts immediately." },
  { id: "enable_2fa", label: "Enable Two-Factor Authentication (2FA) wherever possible." },
  { id: "monitor_financials", label: "Monitor financial accounts for any unauthorized activity." },
  { id: "contact_platform_support", label: "Contact platform support for any directly compromised accounts." },
  { id: "review_linked_apps", label: "Review apps and services linked to your compromised accounts." },
]

export default function AccountSecurityGuidance({ onLogAction }: AccountSecurityGuidanceProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: isChecked }))
    if (isChecked) {
      onLogAction(`Checked: ${itemId}`)
    } else {
      onLogAction(`Unchecked: ${itemId}`)
    }
  }

  return (
    <section aria-labelledby="account-security-guidance-heading">
      <h2 id="account-security-guidance-heading" className="text-xl font-semibold text-black mb-4 text-center">
        Secure Your Accounts
      </h2>
      <p className="text-sm text-neutral-600 mb-6 text-center">
        While Reclaim helps with identity recovery, take these steps to further secure your digital presence.
      </p>
      <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        {guidanceItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-neutral-100">
            <Checkbox
              id={item.id}
              checked={!!checkedItems[item.id]}
              onCheckedChange={(isChecked) => handleCheckChange(item.id, !!isChecked)}
              className="mt-1 border-neutral-400 data-[state=checked]:bg-[#00A86B] data-[state=checked]:border-[#00A86B]"
            />
            <Label htmlFor={item.id} className="text-sm text-neutral-700 cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500 mt-4 text-center flex items-center justify-center">
        <ShieldCheck className="w-4 h-4 mr-1 text-green-600" /> Your diligence is key to comprehensive security.
      </p>
    </section>
  )
}
