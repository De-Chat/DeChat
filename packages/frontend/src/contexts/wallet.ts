import { createContext } from 'react'
import { ethers, Signer } from 'ethers'

export type WalletContextType = {
  provider: ethers.providers.Provider | undefined
  signer: Signer | undefined | null
  address: string | undefined
  chainId: number | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  getAvatarUrl: (address: string) => Promise<string | undefined>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>({
  provider: undefined,
  signer: undefined,
  address: undefined,
  chainId: undefined,
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  getAvatarUrl: async () => undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
})
