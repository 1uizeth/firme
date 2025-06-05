"use client"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link" // Import Link

export default function CompletionScreen() {
  return (
    <div className="w-full max-w-md text-center p-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-black">Active</h1>
      </header>
      <main className="mb-10">
        <CheckCircle className="w-20 h-20 text-[#00A86B] mx-auto mb-6" />
        <p className="text-xl text-neutral-800">
          You're <span className="font-semibold text-[#00A86B]">protected</span>
        </p>
      </main>
      <footer>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button
            asChild // Add asChild prop
            className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
            aria-label="Enter Reclaim System"
          >
            <a>Enter System</a>
          </Button>
        </Link>
      </footer>
    </div>
  )
}
