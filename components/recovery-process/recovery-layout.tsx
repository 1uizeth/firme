import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecoveryLayoutProps {
  headerText: string
  children: React.ReactNode
  userName?: string
  currentStage?: string
}

export default function RecoveryLayout({ headerText, children, userName, currentStage }: RecoveryLayoutProps) {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" passHref legacyBehavior>
              <Button variant="ghost" size="icon" className="mr-2 text-neutral-600 hover:bg-neutral-100">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black">{headerText}</h1>
              {userName && currentStage && (
                <p className="text-xs text-neutral-500 font-mono">
                  {userName} | Stage: {currentStage.replace(/_/g, " ")}
                </p>
              )}
            </div>
          </div>
          {/* Add Sign Out or User Profile icon here if needed */}
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 md:py-12">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">{children}</div>
      </main>
      <footer className="py-8 text-center">
        <p className="font-mono text-xs text-neutral-400">Reclaim Account Recovery &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
