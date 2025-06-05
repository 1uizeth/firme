import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, CheckCircle, Clock, Shield } from "lucide-react"
import Link from "next/link"
import CreatorSearch from "@/components/search/creator-search"

// Mock data for trending creators
const trendingCreators = [
  {
    name: "Alex Crypto",
    handle: "@alexcrypto",
    platform: "Twitter",
    status: "verified",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    name: "Web3 Jane",
    handle: "@web3jane",
    platform: "YouTube",
    status: "under_review",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    name: "NFT Master",
    handle: "@nftmaster",
    platform: "Discord",
    status: "compromised",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Master",
  },
  {
    name: "Crypto Guide",
    handle: "@cryptoguide",
    platform: "Twitter",
    status: "unprotected",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guide",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>
    case "under_review":
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Under Review</Badge>
    case "compromised":
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Compromised</Badge>
    case "unprotected":
      return <Badge className="bg-gray-100 text-gray-800"><Shield className="w-3 h-3 mr-1" /> Unprotected</Badge>
    default:
      return null
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <main className="container mx-auto px-4 py-12 space-y-16 sm:space-y-20">
        <section className="text-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-3 sm:mb-4">
            mymesh
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-700 mb-6 sm:mb-8">
            Decentralized creator verification
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 mb-3">
            <Link href="/onboarding" passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                className="bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-md w-full sm:w-auto"
                aria-label="Begin creator verification setup"
              >
                <a>Verify Your Identity</a>
              </Button>
            </Link>
            <Link href="/contact-verification" passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                className="bg-[#00A86B] hover:bg-[#008F5B] text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-md w-full sm:w-auto"
                aria-label="Verify as a trusted contact"
              >
                <a>I'm a Trusted Contact</a>
              </Button>
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600">Different paths for different roles</p>
        </section>

        {/* Search Section */}
        <section className="text-center space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Check Creator Status</h2>
            <p className="text-lg text-neutral-600">Search for any crypto creator to see their verification status</p>
          </div>
          
          <CreatorSearch />

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-neutral-600">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Trending Creators</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingCreators.map((creator) => (
                <Link key={creator.handle} href={`/creator/${creator.handle.replace("@", "")}`}>
                  <Card className="border-neutral-200 hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <img
                            src={creator.avatarUrl}
                            alt={creator.name}
                            className="rounded-full"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{creator.name}</p>
                          <p className="text-sm text-gray-500 truncate">{creator.handle}</p>
                          <div className="mt-1">{getStatusBadge(creator.status)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Button variant="outline" className="text-neutral-600">
              Add Missing Creator
            </Button>
          </div>
        </section>

        <Separator className="bg-neutral-200" />

        {/* Core Feature Grid */}
        <section className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Why Choose MyMesh?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-[#00A86B] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Decentralized Security</h3>
                <p className="text-neutral-600">
                  Your identity is protected by a network of trusted contacts, not a single point of failure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <AlertCircle className="w-12 h-12 text-[#00A86B] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
                <p className="text-neutral-600">
                  Instant notifications when suspicious activity is detected on your accounts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-[#00A86B] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quick Recovery</h3>
                <p className="text-neutral-600">
                  Restore access to your accounts quickly with help from your trusted network.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
