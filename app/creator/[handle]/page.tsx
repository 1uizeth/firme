"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertCircle, Clock, Shield, Twitter, Youtube, Instagram, MessageSquare, Flag, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        isConnected: true
      },
      {
        id: "social_1_2",
        platform: "YOUTUBE",
        handle: "AlexCryptoOfficial",
        followerCount: 120000,
        verificationStatus: "VERIFIED_SAFE",
        lastChecked: "2023-06-09T10:15:00Z",
        isConnected: true
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
        isConnected: true
      },
      {
        id: "social_2_2",
        platform: "INSTAGRAM",
        handle: "web3jane",
        followerCount: 35000,
        verificationStatus: "VERIFIED_SAFE",
        lastChecked: "2023-06-08T14:20:00Z",
        isConnected: true
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
        isConnected: true
      },
      {
        id: "social_3_2",
        platform: "DISCORD",
        handle: "NFTMaster#1234",
        followerCount: null,
        verificationStatus: "COMPROMISED",
        lastChecked: "2023-06-04T22:45:00Z",
        isConnected: true
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
        isConnected: true
      },
      {
        id: "social_4_2",
        platform: "YOUTUBE",
        handle: "CryptoGuideOfficial",
        followerCount: 25000,
        verificationStatus: "UNPROTECTED",
        lastChecked: "2023-06-07T16:30:00Z",
        isConnected: true
      }
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
      <div className="max-w-4xl mx-auto">
        {/* Creator Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={creator.profileImage || ""} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{creator.displayName}</h1>
            <p className="text-lg text-neutral-600 mb-3">{creator.primaryHandle}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {getStatusBadge(creator.verificationStatus)}
              
              <Badge variant="outline" className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Mesh Strength: {creator.meshStrength}
              </Badge>
              
              <Badge variant="outline" className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Trust Score: {creator.trustScore.toFixed(1)}
              </Badge>
            </div>
            
            {creator.verificationStatus === "COMPROMISED" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  This account is currently compromised. Exercise caution with any recent messages or links.
                </p>
              </div>
            )}
            
            {creator.verificationStatus === "UNDER_REVIEW" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-yellow-700 text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  This account is currently under review. Verification is in progress.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
            <TabsTrigger value="flags">Public Flags {creator.publicFlags.length > 0 && `(${creator.publicFlags.length})`}</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Connected Social Accounts</h2>
            {creator.socialAccounts.length === 0 ? (
              <p className="text-neutral-600">No social accounts connected.</p>
            ) : (
              creator.socialAccounts.map(account => (
                <Card key={account.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getPlatformIcon(account.platform)}
                        <span className="font-medium">{account.platform.toLowerCase()}</span>
                      </div>
                      <div>{getStatusBadge(account.verificationStatus)}</div>
                    </div>
                    <p className="text-neutral-600 mt-2">{account.handle}</p>
                    {account.followerCount && (
                      <p className="text-sm text-neutral-500 mt-1">{account.followerCount.toLocaleString()} followers</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-2">Last verified: {new Date(account.lastChecked).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="flags" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Public Flags</h2>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                Report Issue
              </Button>
            </div>
            
            {creator.publicFlags.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-neutral-600">No public flags reported for this creator.</p>
              </div>
            ) : (
              creator.publicFlags.map(flag => (
                <Card key={flag.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{flag.activityType}</CardTitle>
                      <Badge className={getUrgencyLevelColor(flag.urgencyLevel)}>
                        {flag.urgencyLevel.replace("_", " ")}
                      </Badge>
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
                      
                      <div className="pt-2">
                        <Badge className={
                          flag.status === "NEW" ? "bg-blue-100 text-blue-800" :
                          flag.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800" :
                          flag.status === "RESOLVED" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }>
                          Status: {flag.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
              <Activity className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">Activity log is only visible to the creator and their trusted contacts.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 