import ABI from '../abis/Reclaim.json'
import { UseReadContractReturnType } from 'wagmi'

export const GITHUB_REPOSITORY_URL = 'https://github.com/Principursa/demorepocontracts/blob/main/backend/contracts/Reclaim.sol'
export const OASIS_DOCS_PAGE_URL = 'https://docs.oasis.io/'
export const OASIS_HOME_PAGE_URL = 'https://oasisprotocol.org/'

export const WAGMI_CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_MESSAGE_BOX_ADDR as `0x${string}`,
  abi: ABI,
}

export type WagmiUseReadContractReturnType<
  F extends string,
  R = unknown,
  A extends readonly unknown[] = unknown[]
> = UseReadContractReturnType<typeof ABI, F, A, R | undefined>
