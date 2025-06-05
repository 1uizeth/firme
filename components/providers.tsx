"use client";

import { CivicAuthProvider } from "@civic/auth-web3/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectorsForWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { Chain, sapphire, sapphireTestnet, mainnet, sepolia } from 'viem/chains'
import { createConfig, createConnector, Transport, WagmiProvider } from 'wagmi'
import { Web3AuthContextProvider } from "../providers/Web3AuthProvider";
import { AppStateContextProvider } from "../providers/AppStateProvider";
import { AccountAvatar } from "./account-avatar";
import "@rainbow-me/rainbowkit/styles.css";
import {
  injectedWithSapphire,
  sapphireHttpTransport,
  sapphireLocalnet,
} from '@oasisprotocol/sapphire-wagmi-v2'

// interface ImportMetaEnv {
//   NEXT_PUBLIC_NETWORK: string
//   NEXT_PUBLIC_WEB3_GATEWAY: string
//   NEXT_PUBLIC_MESSAGE_BOX_ADDR: string
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

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

const NEXT_NETWORK_NUMBER = Number(process.env.NEXT_PUBLIC_NETWORK_NUMBER);

export const wagmiConfig = createConfig({
  multiInjectedProviderDiscovery: false,
  connectors: [
    ...connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [
            (wallet => () => ({
              ...wallet,
              id: 'injected-sapphire',
              name: 'Injected (Sapphire)',
              createConnector: walletDetails =>
                createConnector(config => ({
                  ...injectedWithSapphire()(config),
                  ...walletDetails,
                })),
            }))(injectedWallet()),
          ],
        },
      ],
      { appName: 'Demo starter', projectId: 'PROJECT_ID' }
    ),
  ],
  chains: [
    ...(NEXT_NETWORK_NUMBER === 0x5afe ? [sapphire] : []),
    ...(NEXT_NETWORK_NUMBER === 0x5aff ? [sapphireTestnet] : []),
    ...(NEXT_NETWORK_NUMBER === 0x5afd ? [sapphireLocalnet] : []),
  ] as unknown as [Chain],
  transports: {
    ...((NEXT_NETWORK_NUMBER === 0x5afe ? { [sapphire.id]: sapphireHttpTransport() } : {}) as Transport),
    ...((NEXT_NETWORK_NUMBER === 0x5aff
      ? { [sapphireTestnet.id]: sapphireHttpTransport() }
      : {}) as Transport),
    ...(NEXT_NETWORK_NUMBER === 0x5afd ? { [sapphireLocalnet.id]: sapphireHttpTransport() } : {}),
  },
  batch: {
    multicall: false,
  },
})

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