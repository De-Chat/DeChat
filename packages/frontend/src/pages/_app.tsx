import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { createClient, configureChains, chain, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';

const AppWithoutSSR = dynamic(() => import('../components/App'), {
  ssr: false,
})

function AppWrapper({ Component, pageProps }: AppProps) {
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
        <AppWithoutSSR>
          <Component {...pageProps} />
        </AppWithoutSSR>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AppWrapper
