import { useCallback, useEffect, useState } from 'react'
import { WalletContext } from '../contexts/wallet'
import { useRouter } from 'next/router'
import '@rainbow-me/rainbowkit/styles.css';
import { chain, configureChains, createClient, useAccount, useConnect, useDisconnect, useNetwork, useProvider, useSigner, WagmiConfig } from 'wagmi';

const ETH_CHAIN_ID = 1 // Ethereum mainnet

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const provider = useProvider();
  const { address } = useAccount();
  const { chain: chainId } = useNetwork();
  const { data: signer } = useSigner();
  const router = useRouter()

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      if (chainId !== ETH_CHAIN_ID) {
        return undefined
      }
      const address = (await provider?.resolveName(name)) || undefined
      cachedResolveName.set(name, address)
      return address
    },
    [chainId, provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      if (chainId !== ETH_CHAIN_ID) {
        return undefined
      }

      const name = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, name)
      return name
    },
    [chainId, provider]
  )

  const getAvatarUrl = useCallback(
    async (name: string) => {
      if (cachedGetAvatarUrl.has(name)) {
        return cachedGetAvatarUrl.get(name)
      }
      const avatarUrl = (await provider?.getAvatar(name)) || undefined
      cachedGetAvatarUrl.set(name, avatarUrl)
      return avatarUrl
    },
    [provider]
  )

  const disconnect = useCallback(async () => {
    disconnectAccount();
    // router.push('/')
  }, [router])

  const { connect } = useConnect();
  const { disconnect: disconnectAccount } = useDisconnect();

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        resolveName,
        lookupAddress,
        getAvatarUrl,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
