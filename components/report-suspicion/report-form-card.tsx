import type React from "react"
import { Spotlight } from '@/components/core/spotlight'

interface ReportFormCardProps {
  children: React.ReactNode
}

export default function ReportFormCard({ children }: ReportFormCardProps) {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative bg-white border border-zinc-100 rounded-lg shadow-lg p-6 sm:p-8 overflow-hidden">
        <Spotlight
          className="from-[#635BFF]/30 via-[#635BFF]/20 to-transparent blur-3xl"
          size={200}
          springOptions={{
            bounce: 0.3,
            duration: 0.2,
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <svg className="h-full w-full">
            <defs>
              <pattern
                id="grid-pattern"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M0 4H4M4 4V0M4 4H8M4 4V8"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="stroke-[#635BFF]/20"
                />
                <rect
                  x="3"
                  y="3"
                  width="2"
                  height="2"
                  fill="currentColor"
                  fillOpacity="0.05"
                  className="fill-[#635BFF]/10"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>
    </div>
  )
} 