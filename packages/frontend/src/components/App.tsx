import XmtpProvider from './XmtpProvider'
import Layout from '../components/Layout'
import { WalletProvider } from './WalletProvider'
import { createClient, configureChains, chain, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
        <WalletProvider>
          <XmtpProvider>
            <Layout>{children}</Layout>
          </XmtpProvider>
        </WalletProvider>
  )
}

export default App
