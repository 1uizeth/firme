"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ReportSuspicionLayout from "@/components/report-suspicion/report-suspicion-layout"
import PlatformSelectionStep from "@/components/report-suspicion/platform-selection-step"
import DescriptionStep from "@/components/report-suspicion/description-step"
import ConfirmationStep from "@/components/report-suspicion/confirmation-step"
import SubmissionCompleteStep from "@/components/report-suspicion/submission-complete-step"
import { useReclaim } from "@/contexts/reclaim-context"
import { Button } from "@/components/ui/button" // For error state
import { AlertCircle } from "lucide-react" // For error state
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Shield, Twitter, Youtube, Instagram, MessageSquare, Activity, Users } from "lucide-react"

const TOTAL_FORM_STEPS = 3 // Platforms, Description, Confirmation

// Creator profile interface and mock data (same as creator profile page)
interface CreatorProfile {
  id: string;
  displayName: string;
  primaryHandle: string;
  profileImage: string | null;
  verificationStatus: "VERIFIED_SAFE" | "UNDER_REVIEW" | "COMPROMISED" | "UNPROTECTED";
  meshStrength: number;
  trustScore: number;
  isPublic: boolean;
  createdAt: string;
  lastActiveAt: string;
  socialAccounts: SocialAccount[];
  publicFlags: PublicFlag[];
}

interface SocialAccount {
  id: string;
  platform: "TWITTER" | "YOUTUBE" | "DISCORD" | "INSTAGRAM" | "TIKTOK";
  handle: string;
  followerCount: number | null;
  verificationStatus: "VERIFIED_SAFE" | "UNDER_REVIEW" | "COMPROMISED" | "UNPROTECTED";
  lastChecked: string;
  isConnected: boolean;
  profileImage?: string;
}

interface PublicFlag {
  id: string;
  reporterName: string | null;
  reporterContact: string | null;
  activityType: string;
  platform: "TWITTER" | "YOUTUBE" | "DISCORD" | "INSTAGRAM" | "TIKTOK";
  description: string;
  urgencyLevel: "IMMEDIATE" | "SOON" | "WHEN_CONVENIENT";
  status: "NEW" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  resolvedAt: string | null;
}

// Mock creators data (same as creator profile page)
const mockCreators: Record<string, CreatorProfile> = {
  "alexcrypto": {
    id: "creator_1",
    displayName: "Alex Crypto",
    primaryHandle: "@alexcrypto",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    verificationStatus: "VERIFIED_SAFE",
    meshStrength: 8,
    trustScore: 92.5,
    isPublic: true,
    createdAt: "2023-01-15T12:00:00Z",
    lastActiveAt: "2023-06-10T15:30:00Z",
    socialAccounts: [
      {
        id: "social_1_1",
        platform: "TWITTER",
        handle: "@alexcrypto",
        followerCount: 45000,
        verificationStatus: "VERIFIED_SAFE",
        lastChecked: "2023-06-10T15:30:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexTwitter"
      },
      {
        id: "social_1_2",
        platform: "YOUTUBE",
        handle: "AlexCryptoOfficial",
        followerCount: 120000,
        verificationStatus: "VERIFIED_SAFE",
        lastChecked: "2023-06-09T10:15:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexYoutube"
      }
    ],
    publicFlags: []
  },
  "web3jane": {
    id: "creator_2",
    displayName: "Web3 Jane",
    primaryHandle: "@web3jane",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    verificationStatus: "UNDER_REVIEW",
    meshStrength: 5,
    trustScore: 78.3,
    isPublic: true,
    createdAt: "2023-02-20T09:30:00Z",
    lastActiveAt: "2023-06-09T18:45:00Z",
    socialAccounts: [
      {
        id: "social_2_1",
        platform: "TWITTER",
        handle: "@web3jane",
        followerCount: 28000,
        verificationStatus: "UNDER_REVIEW",
        lastChecked: "2023-06-09T18:45:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=JaneTwitter"
      },
      {
        id: "social_2_2",
        platform: "INSTAGRAM",
        handle: "web3jane",
        followerCount: 35000,
        verificationStatus: "VERIFIED_SAFE",
        lastChecked: "2023-06-08T14:20:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=JaneInstagram"
      }
    ],
    publicFlags: [
      {
        id: "flag_2_1",
        reporterName: "Anonymous",
        reporterContact: null,
        activityType: "Suspicious Login",
        platform: "TWITTER",
        description: "Unusual posting pattern noticed in the last 24 hours",
        urgencyLevel: "SOON",
        status: "UNDER_REVIEW",
        createdAt: "2023-06-08T10:30:00Z",
        resolvedAt: null
      }
    ]
  },
  "nftmaster": {
    id: "creator_3",
    displayName: "NFT Master",
    primaryHandle: "@nftmaster",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Master",
    verificationStatus: "COMPROMISED",
    meshStrength: 3,
    trustScore: 45.0,
    isPublic: true,
    createdAt: "2022-11-05T16:20:00Z",
    lastActiveAt: "2023-06-05T08:10:00Z",
    socialAccounts: [
      {
        id: "social_3_1",
        platform: "TWITTER",
        handle: "@nftmaster",
        followerCount: 65000,
        verificationStatus: "COMPROMISED",
        lastChecked: "2023-06-05T08:10:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MasterTwitter"
      },
      {
        id: "social_3_2",
        platform: "DISCORD",
        handle: "NFTMaster#1234",
        followerCount: null,
        verificationStatus: "COMPROMISED",
        lastChecked: "2023-06-04T22:45:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MasterDiscord"
      }
    ],
    publicFlags: [
      {
        id: "flag_3_1",
        reporterName: "Security Team",
        reporterContact: "security@platform.com",
        activityType: "Phishing Links",
        platform: "TWITTER",
        description: "Account is posting phishing links to fake NFT mints",
        urgencyLevel: "IMMEDIATE",
        status: "NEW",
        createdAt: "2023-06-04T22:30:00Z",
        resolvedAt: null
      },
      {
        id: "flag_3_2",
        reporterName: "Community Member",
        reporterContact: null,
        activityType: "Scam Promotion",
        platform: "DISCORD",
        description: "Promoting fake giveaways in multiple servers",
        urgencyLevel: "IMMEDIATE",
        status: "NEW",
        createdAt: "2023-06-05T01:15:00Z",
        resolvedAt: null
      }
    ]
  },
  "cryptoguide": {
    id: "creator_4",
    displayName: "Crypto Guide",
    primaryHandle: "@cryptoguide",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guide",
    verificationStatus: "UNPROTECTED",
    meshStrength: 0,
    trustScore: 60.8,
    isPublic: true,
    createdAt: "2023-03-10T11:45:00Z",
    lastActiveAt: "2023-06-08T19:20:00Z",
    socialAccounts: [
      {
        id: "social_4_1",
        platform: "TWITTER",
        handle: "@cryptoguide",
        followerCount: 18000,
        verificationStatus: "UNPROTECTED",
        lastChecked: "2023-06-08T19:20:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=GuideTwitter"
      },
      {
        id: "social_4_2",
        platform: "YOUTUBE",
        handle: "CryptoGuideOfficial",
        followerCount: 25000,
        verificationStatus: "UNPROTECTED",
        lastChecked: "2023-06-07T16:30:00Z",
        isConnected: true,
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=GuideYoutube"
      }
    ],
    publicFlags: []
  },
  "Arthur1Jacobina": {
    id: "creator_5",
    displayName: "Arthur Jacobina",
    primaryHandle: "@Arthur1Jacobina",
    profileImage: "https://pbs.twimg.com/profile_images/1893871242760835072/Vdy0aKFN_400x400.jpg",
    verificationStatus: "UNPROTECTED",
    meshStrength: 5,
    trustScore: 99.8,
    isPublic: true,
    createdAt: "2023-03-10T11:45:00Z",
    lastActiveAt: "2023-06-08T19:20:00Z",
    socialAccounts: [
      {
        id: "social_4_1",
        platform: "TWITTER",
        handle: "@Arthur1Jacobina",
        followerCount: 105,
        verificationStatus: "UNPROTECTED",
        lastChecked: "2023-06-08T19:20:00Z",
        isConnected: true,
        profileImage: "https://pbs.twimg.com/profile_images/1893871242760835072/Vdy0aKFN_400x400.jpg"
      },
    ],
    publicFlags: []
  }
};

// Helper functions (same as creator profile page)
const getStatusBadge = (status: string) => {
  switch (status) {
    case "VERIFIED_SAFE":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
    case "UNDER_REVIEW":
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Under Review</Badge>;
    case "COMPROMISED":
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Compromised</Badge>;
    case "UNPROTECTED":
      return <Badge className="bg-gray-100 text-gray-800"><Shield className="w-3 h-3 mr-1" /> Unprotected</Badge>;
    default:
      return null;
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "TWITTER":
      return <Twitter className="w-4 h-4 mr-1" />;
    case "YOUTUBE":
      return <Youtube className="w-4 h-4 mr-1" />;
    case "INSTAGRAM":
      return <Instagram className="w-4 h-4 mr-1" />;
    case "DISCORD":
      return <MessageSquare className="w-4 h-4 mr-1" />;
    case "TIKTOK":
      return <Activity className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

// Creator Summary Card Component
const CreatorSummaryCard = ({ creator }: { creator: CreatorProfile }) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900">Reporting Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.profileImage || ""} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{creator.displayName}</h3>
            <p className="text-gray-600 mb-2">{creator.primaryHandle}</p>
            {getStatusBadge(creator.verificationStatus)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{creator.trustScore}%</div>
            <div className="text-sm text-gray-600">Trust Score</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{creator.meshStrength}/10</div>
            <div className="text-sm text-gray-600">Mesh Strength</div>
          </div>
        </div>

        {creator.socialAccounts.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Social Accounts</h4>
            <div className="space-y-2">
              {creator.socialAccounts.slice(0, 3).map(account => (
                <div key={account.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(account.platform)}
                    <span className="font-medium">{account.handle}</span>
                  </div>
                  {account.followerCount && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-3 h-3" />
                      {account.followerCount.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
              {creator.socialAccounts.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{creator.socialAccounts.length - 3} more accounts
                </p>
              )}
            </div>
          </div>
        )}

        {creator.publicFlags.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ {creator.publicFlags.length} active flag{creator.publicFlags.length > 1 ? 's' : ''} reported
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ReportSuspicionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userProfile: monitoredUser, reportSuspicionByEmergencyContact, isLoading, contextError: contextError } = useReclaim()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [reportedCreator, setReportedCreator] = useState<CreatorProfile | null>(null)

  // Get handle from URL parameters
  const handle = searchParams.get('handle')

  // Load creator data if handle is provided
  useEffect(() => {
    if (handle) {
      const creator = mockCreators[handle]
      if (creator) {
        setReportedCreator(creator)
      }
    }
  }, [handle])

  // Effect to redirect if no monitored user (e.g. direct navigation without context)
  useEffect(() => {
    if (!isLoading && !monitoredUser) {
      // Allow a brief moment for context to load
      setTimeout(() => {
        if (!monitoredUser) {
          console.warn("No monitored user found in context. Redirecting.")
          router.push("/contact-dashboard") // Or to an error page/homepage
        }
      }, 500)
    }
  }, [monitoredUser, isLoading, router])

  const reportInitiationTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handlePlatformsSelected = (platforms: string[]) => {
    setSelectedPlatforms(platforms)
    setCurrentStep(2) // Move to DescriptionStep
  }

  const handleDescriptionSubmitted = (desc: string) => {
    setDescription(desc)
    setCurrentStep(3) // Move to ConfirmationStep
  }

  const handleSubmitReport = async () => {
    if (!monitoredUser) {
      setFormError("Monitored user data is not available. Cannot submit report.")
      return
    }
    setFormError(null)
    // Assuming the emergency contact's name could be fetched or is known
    // For now, we can pass undefined or a generic name.
    await reportSuspicionByEmergencyContact(selectedPlatforms, description, "Emergency Contact")
    if (!contextError) {
      // Check if context had an error during submission
      setCurrentStep(4) // Move to SubmissionCompleteStep
    } else {
      setFormError(`Failed to submit report: ${contextError}. Please try again.`)
    }
  }

  const handleEditReport = () => {
    setCurrentStep(1) // Go back to the first step (Platform Selection)
  }

  const handleCancelReport = () => {
    router.push("/contact-dashboard")
  }

  if (isLoading && !monitoredUser) {
    return <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4">Loading...</div>
  }

  if (!monitoredUser) {
    // This state might be hit briefly before useEffect redirects, or if context fails to load user
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-neutral-700 mb-6">
          Could not load monitored user data. You may need to log in or select a user to monitor.
        </p>
        <Button onClick={() => router.push("/contact-dashboard")}>Go to Contact Dashboard</Button>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlatformSelectionStep
            onPlatformsSelected={handlePlatformsSelected}
            initialSelectedPlatforms={selectedPlatforms}
          />
        )
      case 2:
        return <DescriptionStep onDescriptionSubmitted={handleDescriptionSubmitted} initialDescription={description} />
      case 3:
        return (
          <ConfirmationStep
            monitoredUserName={monitoredUser.name}
            selectedPlatforms={selectedPlatforms}
            description={description}
            onSubmit={handleSubmitReport}
            onEdit={handleEditReport}
            onCancel={handleCancelReport}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <SubmissionCompleteStep 
            monitoredUserName={monitoredUser.name}
            selectedPlatforms={selectedPlatforms}
            description={description}
          />
        )
      default:
        return <p>Invalid step.</p>
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-neutral-100 p-4 sm:p-6">
      <div className="w-full max-w-7xl">
        {reportedCreator ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Creator Summary Card - Left Side */}
            <div className="lg:col-span-1">
              <CreatorSummaryCard creator={reportedCreator} />
            </div>
            
            {/* Report Form - Right Side */}
            <div className="lg:col-span-2">
              <ReportSuspicionLayout>
                {formError && (
                  <p className="text-sm text-red-600 mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">
                    {formError}
                  </p>
                )}
                {renderStepContent()}
              </ReportSuspicionLayout>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ReportSuspicionLayout>
              {formError && (
                <p className="text-sm text-red-600 mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">
                  {formError}
                </p>
              )}
              {renderStepContent()}
            </ReportSuspicionLayout>
          </div>
        )}
      </div>
    </div>
  )
}
