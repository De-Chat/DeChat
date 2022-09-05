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
  const { chains, provider, webSocketProvider } = configureChains(
    [
      chain.mainnet,
      chain.polygon,
      chain.optimism,
      chain.arbitrum,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
        ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
        : []),
    ],
    [
      alchemyProvider({ apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
      publicProvider(),
    ]
  );

  const { wallets } = getDefaultWallets({
    appName: 'RainbowKit demo',
    chains,
  });

  const connectors = connectorsForWallets([
    ...wallets,
    {
      groupName: 'Other',
      wallets: [
        wallet.argent({ chains }),
        wallet.trust({ chains }),
        wallet.ledger({ chains }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  const demoAppInfo = {
    appName: 'Rainbowkit Demo',
  };

  console.log("test provider and wagmiClient: ", provider, wagmiClient);

  return (
    <WagmiConfig client={wagmiClient} >
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <WalletProvider>
          <XmtpProvider>
            <Layout>{children}</Layout>
          </XmtpProvider>
        </WalletProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
