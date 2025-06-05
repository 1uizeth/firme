"use client";
import { useUser } from "@civic/auth/react";
import { UserButton } from "@civic/auth/react";
import { getUser } from "@civic/auth/nextjs";
import { cn } from "@/lib/utils";

export type MyUserButtonProps = {
    isClicked?: boolean;
    onToggleClick?: (isClicked: boolean) => void;
    className?: string;
};

async function asyncGetUser() {
    const user = await getUser();
    return user;
}

export default function MyUserButton({ isClicked = false, onToggleClick, className }: MyUserButtonProps) {
    const { user } = useUser();

    const asyncUser = asyncGetUser();
    console.log(asyncUser);
    
    const handleClick = () => {
        if (onToggleClick) {
            onToggleClick(!isClicked);
        }
        
    };

    return (
        <div className={cn("flex flex-col items-center justify-center", className)}>
            <div className="align-center">
                {user ? (
                    <div className="text-center items-center justify-center">
                        <div onClick={handleClick} className="mb-2 cursor-pointer flex items-center justify-center">
                            <UserButton />
                        </div>
                        <button 
                            onClick={handleClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                            {isClicked ? 'Hide Wallet Options' : 'Connect Wallet'}
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <UserButton />
                        <div className="mt-4 text-sm text-gray-600">Sign in to connect your wallet</div>
                    </div>
                )}
            </div>
        </div>
    );
}