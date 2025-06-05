import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function LandingPage() {
  // In a real application, this would come from a server or API
  const lastCheckTimestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "shortOffset", // e.g., GMT-4
  })

  const features = [
    {
      title: "Verify",
      description: "Identity confirmation in secure environment",
    },
    {
      title: "Monitor",
      description: "Continuous breach detection",
    },
    {
      title: "Recover",
      description: "Trusted contact notification system",
    },
  ]

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 md:space-y-28">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-3 sm:mb-4">
            Reclaim
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-700 mb-6 sm:mb-8">
            Cryptographic identity recovery
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 mb-3">
            <Button
              asChild
              size="lg"
              className="bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-md w-full sm:w-auto"
              aria-label="Begin identity recovery setup"
            >
              <Link href="/onboarding">Begin Setup</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-md w-full sm:w-auto"
              aria-label="Verify as an emergency contact"
            >
              <Link href="/contact-verification">I'm an Emergency Contact</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600">Different paths for different roles</p>
        </section>

        <Separator className="bg-neutral-200" />

        {/* Core Feature Grid */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            Core Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-neutral-300 shadow-none rounded-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-black">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="bg-neutral-200" />

        {/* System Status */}
        <section aria-labelledby="system-status-heading" className="text-center">
          <h2 id="system-status-heading" className="text-2xl sm:text-3xl font-semibold mb-6 text-black">
            System Status
          </h2>
          <div className="font-mono text-base sm:text-lg space-y-2 text-neutral-800">
            <p>
              Status: <span className="text-[#00A86B] font-semibold">OPERATIONAL</span>
            </p>
            <p>Current Uptime: 99.997%</p>
            <p>Last Security Check: {lastCheckTimestamp}</p>
          </div>
        </section>
      </main>

      <footer className="py-6 sm:py-8 border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500 font-mono text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Reclaim. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
