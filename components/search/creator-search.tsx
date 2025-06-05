"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatorSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/creator/${searchQuery.trim().replace(/^@/, "")}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-full mx-auto">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search by handle (e.g. @web3jane)"
          className="pl-10 pr-12 py-6 text-base rounded-full border-2 focus-visible:ring-4 focus-visible:ring-[#635BFF]/20 focus-visible:ring-offset-0 focus-visible:border-[#635BFF] transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-[#635BFF] hover:bg-[#635BFF]/90 rounded-full shadow-sm transition-colors duration-200"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
} 