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
    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
      <div className="flex items-center w-full">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by handle (e.g. @web3jane)"
            className="pl-10 py-6 text-base rounded-l-md rounded-r-none border-r-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>
        <Button 
          type="submit" 
          className="bg-[#00A86B] hover:bg-[#008F5B] rounded-l-none py-6"
        >
          Search
        </Button>
      </div>
    </form>
  );
} 