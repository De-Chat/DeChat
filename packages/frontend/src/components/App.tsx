import XmtpProvider from './XmtpProvider'
import Layout from './Layout'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { wagmiClient, chains } from '@shared/wagmiClient'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {env} from '@shared/environment'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChain={env.defaultChain}>
        <XmtpProvider>
          <Layout>{children}</Layout>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
