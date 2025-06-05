"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export function WalletConnect({ onNextStep }: { onNextStep: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to handle wallet connection
  useEffect(() => {
    if (isConnected) {
      // Trigger the next step when wallet is connected
      onNextStep();
    }
  }, [isConnected, onNextStep]);
  
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-gray-900 dark:text-white">
          Loading wallet connection...
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-center">
        <ConnectButton showBalance={true} />
      </div>
      <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
        Connect with MetaMask or other wallets
      </div>
    </div>
  );
} 