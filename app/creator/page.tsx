"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleParam = searchParams.get("handle");

  useEffect(() => {
    // If handle is provided in query params, redirect to the dynamic route
    if (handleParam) {
      router.push(`/creator/${handleParam}`);
    } else {
      // Default redirect to Alex Crypto's profile if no handle is provided
      router.push("/creator/alexcrypto");
    }
  }, [router, handleParam]);

  // Return a loading state while redirecting
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A86B] mx-auto"></div>
        <p className="mt-4 text-lg">Redirecting to creator profile...</p>
      </div>
    </div>
  );
}
