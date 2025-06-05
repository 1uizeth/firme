import type React from "react"
import ReportFormCard from "./report-form-card"

interface ReportSuspicionLayoutProps {
  headerText?: string
  children: React.ReactNode
  currentStep?: number
  totalSteps?: number
  contextText?: string
  timestamp?: string
}

export default function ReportSuspicionLayout({
  children,
}: ReportSuspicionLayoutProps) {
  return (
    <div className="w-full text-center">
      <ReportFormCard>
        {children}
      </ReportFormCard>
    </div>
  )
}
