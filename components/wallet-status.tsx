"use client"

import { useAccount } from 'wagmi'
import { Button } from "@/components/ui/button"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'

export function WalletStatusHeader() {
  const { isConnected } = useAccount()

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-neutral-200 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#00A86B]" />
          <span className="text-sm font-medium text-neutral-600">Firme</span>
        </div>
        <div className="flex items-center">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted
              if (!ready) {
                return null
              }

              if (!account) {
                return (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={openConnectModal}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain?.unsupported) {
                return (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={openChainModal}
                    className="text-sm"
                  >
                    Wrong Network
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-3">
                  {chain && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openChainModal}
                      className="hidden sm:flex items-center gap-2 text-sm"
                    >
                      {chain.hasIcon && chain.iconUrl && (
                        <div className="w-4 h-4">
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        </div>
                      )}
                      {chain.name}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAccountModal}
                    className="text-sm"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  )
} 