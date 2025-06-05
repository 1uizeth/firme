"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ShieldQuestion, Calendar, Clock, User, Flag, FileText } from "lucide-react"
import Link from "next/link"

interface SubmissionCompleteStepProps {
  monitoredUserName: string
  selectedPlatforms?: string[]
  description?: string
}

export default function SubmissionCompleteStep({ 
  monitoredUserName, 
  selectedPlatforms = [], 
  description = "" 
}: SubmissionCompleteStepProps) {
  const submissionTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const reportId = `RPT-${Date.now().toString().slice(-8)}`

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-[#635BFF] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Thank You!</h2>
        <p className="text-neutral-600">Your report has been successfully submitted</p>
      </div>

      {/* Receipt Card */}
      <Card className="bg-white border-2 border-neutral-200 mb-6">
        <CardContent className="p-6">
          {/* Header with dashed line */}
          <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-neutral-300">
            <h3 className="text-lg font-semibold text-neutral-800">Suspension Report Receipt</h3>
            <p className="text-sm text-neutral-600">Report ID: {reportId}</p>
          </div>

          {/* Report Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#635BFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Reported User</p>
                <p className="text-neutral-800 font-semibold">Arthur1Jacobina</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Flag className="w-5 h-5 text-[#635BFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Platforms Reported</p>
                <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
                  {selectedPlatforms.length > 0 ? (
                    selectedPlatforms.map((platform, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-600 text-sm">All platforms</span>
                  )}
                </div>
              </div>
            </div>

            {description && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#635BFF] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700">Description</p>
                  <p className="text-neutral-800 text-sm mt-1 bg-neutral-50 p-2 rounded border">
                    {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#635BFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Submission Date</p>
                <p className="text-neutral-800">{submissionTime}</p>
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="my-6 border-b-2 border-dashed border-neutral-300"></div>

          {/* Status and Next Steps */}
          <div className="text-center space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 font-medium text-sm">✓ Report Successfully Processed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Link href="/">
        <Button className="w-full bg-[#635BFF] hover:bg-[#635BFF]/90 text-white py-3 text-lg rounded-md">
          Return Dashboard
        </Button>
      </Link>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500 mt-4">
        Keep this receipt for your records. Report ID: {reportId}
      </p>
    </div>
  )
}
