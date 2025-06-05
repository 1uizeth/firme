"use client";

import { CivicAuthProvider } from "@civic/auth-web3/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, Theme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { Chain, mainnet, sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { Web3AuthContextProvider } from "../providers/Web3AuthProvider";
import { AppStateContextProvider } from "../providers/AppStateProvider";
import { AccountAvatar } from "./account-avatar";

const config = getDefaultConfig({
  appName: "Firme",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

// Configure chains and RPC URLs.
export const supportedChains = [mainnet, sepolia] as [
  Chain,
  ...Chain[],
];

const rainbowKitTheme: Theme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
};

// Configure RainbowKit
// To get a WalletConnect ProjectID:
// 1. Go to https://cloud.walletconnect.com/sign-in
// 2. Sign up or sign in
// 3. Create a new project
// 4. Copy the Project ID and paste it below

// Create Wagmi config with RainbowKit connectors
const wagmiConfig = getDefaultConfig({
  appName: "Firme",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: supportedChains,
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={rainbowKitTheme}
          avatar={({ size, address }) => <AccountAvatar size={size} address={address} />}
          modalSize="compact"
        >
          <Web3AuthContextProvider>
            <AppStateContextProvider>
              <CivicAuthProvider
                initialChain={sepolia}
                clientId={"4754305d-58df-47cf-b874-4186b1210afa"}
              >
                {children}
              </CivicAuthProvider>
            </AppStateContextProvider>
          </Web3AuthContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}