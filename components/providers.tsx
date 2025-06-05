"use client";

import { CivicAuthProvider } from "@civic/auth-web3/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectorsForWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { Chain, sepolia } from "wagmi/chains";
import { createConfig, createConnector, WagmiProvider } from 'wagmi'
import { Web3AuthContextProvider } from "../providers/Web3AuthProvider";
import { AppStateContextProvider } from "../providers/AppStateProvider";
import { AccountAvatar } from "./account-avatar";
import "@rainbow-me/rainbowkit/styles.css";
import {
  injectedWithSapphire,
  sapphireHttpTransport,
} from '@oasisprotocol/sapphire-wagmi-v2'
import { sapphire } from 'viem/chains'

// interface ImportMetaEnv {
//   NEXT_PUBLIC_NETWORK: string
//   NEXT_PUBLIC_WEB3_GATEWAY: string
//   NEXT_PUBLIC_MESSAGE_BOX_ADDR: string
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

const queryClient = new QueryClient();

// Define Sapphire Testnet chain
const sapphireTestnet = {
  ...sapphire,
  id: 0x5aff,
  name: 'Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    name: 'TEST',
    symbol: 'TEST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.dev'],
    },
    public: {
      http: ['https://testnet.sapphire.oasis.dev'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Testnet Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.dev',
    },
  },
  testnet: true,
} as const;

// Configure the theme
const rainbowKitTheme: Theme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
};

// Create Wagmi config for Sapphire Testnet
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
      { 
        appName: 'Firme',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "PROJECT_ID"
      }
    ),
  ],
  chains: [sapphireTestnet] as [Chain, ...Chain[]],
  transports: {
    [sapphireTestnet.id]: sapphireHttpTransport()
  },
  batch: {
    multicall: false,
  },
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