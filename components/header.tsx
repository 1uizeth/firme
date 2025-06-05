"use client"
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
export type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  return (
    <header className={cn("w-full bg-white shadow-sm border-b border-gray-200", className)}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center" onClick={() => router.push(`/`)}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={90}
              height={90}
              className="h-8 w-auto"
              priority
            />
          </div>
          
          {/* Profile Picture */}
          <div className="flex items-center">

            <Button className="mr-5 bg-[#635BFF] hover:bg-[#635BFF]/90" onClick={() => router.push(`/report`)}>
                <span>Report Scammer</span>
            </Button>
            <div className="relative">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=aneafgg"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-1 border-gray-300 transition-colors cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-600 ml-2">1uiz</p>
          </div>
        </div>
      </div>
    </header>
  );
}
