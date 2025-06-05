"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertCircle, Clock, Shield, Twitter, Youtube, Instagram, MessageSquare, Flag, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Types based on the schema
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

// Mock data for different creators
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
    meshStrength: 9,
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

// Helper function to get status badge
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

// Helper function to get platform icon
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

// Helper function to get urgency level color
const getUrgencyLevelColor = (level: string) => {
  switch (level) {
    case "IMMEDIATE":
      return "bg-red-100 text-red-800";
    case "SOON":
      return "bg-yellow-100 text-yellow-800";
    case "WHEN_CONVENIENT":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function CreatorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.handle as string;
  
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with a timeout
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const foundCreator = mockCreators[handle];
      if (foundCreator) {
        setCreator(foundCreator);
        setLoading(false);
      } else {
        setError(`Creator with handle ${handle} not found`);
        setLoading(false);
      }
    }, 500);
  }, [handle]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A86B] mx-auto"></div>
          <p className="mt-4 text-lg">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Creator Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" passHref>
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!creator) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Creator Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={creator.profileImage || ""} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{creator.displayName}</h1>
            <p className="text-lg text-neutral-600 mb-3">{creator.primaryHandle}</p>
          </div>
        </div>
        
        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Creator Profile + Flags (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Public Flags Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Flags {creator.publicFlags.length > 0 && `(${creator.publicFlags.length})`}</h2>
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => router.push(`/report?handle=${handle}`)}>
                  <Flag className="w-4 h-4" />
                  Report
                </Button>
              </div>
              
              {creator.publicFlags.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-neutral-600">No public flags reported for this creator.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {creator.publicFlags.map(flag => (
                    <div key={flag.id} className="relative">
                      <ShineBorder 
                        shineColor={["#EF4444", "#F87171", "#FCA5A5"]}
                        className="rounded-lg"
                      />
                      <Card className="relative bg-white">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-medium">{flag.activityType}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-neutral-700">{flag.description}</p>
                            
                            <div className="flex flex-wrap gap-2 text-sm">
                              <Badge variant="outline" className="flex items-center">
                                {getPlatformIcon(flag.platform)}
                                {flag.platform}
                              </Badge>
                              
                              <Badge variant="outline" className="text-neutral-600">
                                Reported: {new Date(flag.createdAt).toLocaleDateString()}
                              </Badge>
                              
                              {flag.reporterName && (
                                <Badge variant="outline" className="text-neutral-600">
                                  By: {flag.reporterName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Social Accounts (1/3 width) */}
          <div className="absolute w-[20vw] top-[12vh] right-[15vw] lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-6">Social Accounts</h2>
            {creator.socialAccounts.length === 0 ? (
              <p className="text-neutral-600">No social accounts connected.</p>
            ) : (
              <div className="space-y-4">
                {creator.socialAccounts.map(account => (
                  <div key={account.id} className="relative overflow-hidden hover:scale-105 transition-all duration-200">
                    <ShineBorder 
                      shineColor={["#00A86B", "#4ADE80", "#10B981"]}
                      className="rounded-lg p-4 w-full"
                    />
                    <Card className="relative bg-white overflow-hidden">
                      <div className="flex h-32">
                        {/* Image section - 1/3 width */}
                        <div className="relative w-1/3 overflow-hidden">
                          <img
                            src={account.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.handle}`}
                            alt={`${account.handle} profile`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Text content section - 2/3 width */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(account.platform)}
                                <span className="font-semibold text-gray-900 capitalize">
                                  {account.platform.toLowerCase()}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {account.handle}
                            </h3>
                            {account.followerCount && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {account.followerCount.toLocaleString()} followers
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Last verified: {new Date(account.lastChecked).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 