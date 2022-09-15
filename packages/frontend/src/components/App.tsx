import XmtpProvider from './XmtpProvider'
import Layout from './Layout'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { wagmiClient, chains } from '@shared/wagmiClient'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@styles/theme'
import { env } from '@shared/environment'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChain={env.defaultChain}>
        <XmtpProvider>
          <ChakraProvider theme={theme}>
            <Layout>{children}</Layout>
          </ChakraProvider>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
