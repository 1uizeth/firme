"use client"

import { useState } from "react"
import ProtectedCreatorCard from "@/components/contact-dashboard/protected-creator-card"
import FlagReviewSection from "@/components/contact-dashboard/flag-review-section"
import ConsensusVoting from "@/components/contact-dashboard/consensus-voting"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock data for demo purposes
const mockProtectedCreators = [
  {
    name: "Alex Crypto",
    handle: "@alexcrypto",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    platforms: [
      { name: "Twitter", handle: "@alexcrypto" },
      { name: "YouTube", handle: "AlexCryptoOfficial" },
    ],
    status: "verified" as const,
    publicFlagCount: 3,
    recentActivity: [
      {
        type: "flag" as const,
        message: "Suspicious login attempt reported",
        timestamp: "2 hours ago",
      },
      {
        type: "mesh_alert" as const,
        message: "Identity verification completed",
        timestamp: "1 day ago",
      },
    ],
  },
  {
    name: "Web3 Jane",
    handle: "@web3jane",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    platforms: [
      { name: "Twitter", handle: "@web3jane" },
      { name: "Discord", handle: "Web3 Jane's Community" },
    ],
    status: "under_review" as const,
    publicFlagCount: 5,
    recentActivity: [
      {
        type: "flag" as const,
        message: "Multiple community reports of suspicious activity",
        timestamp: "1 hour ago",
      },
    ],
  },
]

const mockFlags = [
  {
    id: "1",
    creatorName: "Alex Crypto",
    creatorHandle: "@alexcrypto",
    reporterName: "Community Member",
    reporterEvidence: [
      {
        type: "screenshot" as const,
        url: "https://example.com/evidence1.jpg",
      },
    ],
    description: "Suspicious tweets promoting unverified projects",
    timestamp: "2 hours ago",
    status: "pending" as const,
  },
  {
    id: "2",
    creatorName: "Web3 Jane",
    creatorHandle: "@web3jane",
    reporterEvidence: [
      {
        type: "link" as const,
        url: "https://twitter.com/suspicious_tweet",
      },
    ],
    description: "Unusual activity pattern detected",
    timestamp: "1 hour ago",
    status: "investigating" as const,
  },
]

const mockEscalatedFlags = [
  {
    id: "3",
    creatorName: "Alex Crypto",
    creatorHandle: "@alexcrypto",
    description: "Multiple reports of compromised social media accounts",
    timestamp: "1 hour ago",
    timeRemaining: "23 hours",
    votes: {
      approve: 2,
      reject: 1,
      total: 5,
      yourVote: "approve" as const,
    },
    meshMembers: [
      { name: "Trusted Contact 1", hasVoted: true, vote: "approve" as const },
      { name: "Trusted Contact 2", hasVoted: true, vote: "approve" as const },
      { name: "Trusted Contact 3", hasVoted: true, vote: "reject" as const },
      { name: "Trusted Contact 4", hasVoted: false },
      { name: "Trusted Contact 5", hasVoted: false },
    ],
  },
]

export default function ContactDashboardPage() {
  const [activeTab, setActiveTab] = useState("creators")

  const handleRequestVerification = () => {
    console.log("Requesting verification")
  }

  const handleMarkCompromised = () => {
    console.log("Marking as compromised")
  }

  const handleOverrideFlags = () => {
    console.log("Overriding flags")
  }

  const handleEmergencyUpdate = () => {
    console.log("Emergency update")
  }

  const handleEscalateFlag = (flagId: string) => {
    console.log("Escalating flag", flagId)
  }

  const handleInvestigateFlag = (flagId: string) => {
    console.log("Investigating flag", flagId)
  }

  const handleDismissFlag = (flagId: string) => {
    console.log("Dismissing flag", flagId)
  }

  const handleContactMesh = (flagId: string) => {
    console.log("Contacting mesh members", flagId)
  }

  const handleVote = (flagId: string, vote: "approve" | "reject") => {
    console.log("Voting on flag", flagId, vote)
  }

  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-black">Trusted Contact Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="creators">Protected Creators</TabsTrigger>
            <TabsTrigger value="flags">Flag Review</TabsTrigger>
            <TabsTrigger value="consensus">Consensus Voting</TabsTrigger>
          </TabsList>

          <TabsContent value="creators" className="space-y-6">
            <h2 className="text-2xl font-semibold">Creators You Protect</h2>
            <div className="grid gap-6">
              {mockProtectedCreators.map((creator) => (
                <ProtectedCreatorCard
                  key={creator.handle}
                  {...creator}
                  onRequestVerification={handleRequestVerification}
                  onMarkCompromised={handleMarkCompromised}
                  onOverrideFlags={handleOverrideFlags}
                  onEmergencyUpdate={handleEmergencyUpdate}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flags">
            <FlagReviewSection
              flags={mockFlags}
              onEscalateFlag={handleEscalateFlag}
              onInvestigateFlag={handleInvestigateFlag}
              onDismissFlag={handleDismissFlag}
              onContactMesh={handleContactMesh}
            />
          </TabsContent>

          <TabsContent value="consensus">
            <ConsensusVoting
              escalatedFlags={mockEscalatedFlags}
              onVote={handleVote}
              onContactMember={handleContactMesh}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
