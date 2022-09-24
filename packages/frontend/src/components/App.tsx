import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import theme from '@styles/theme';
import { env } from 'src/helpers/environment';
import { chains, wagmiClient } from 'src/services/wagmiClient';
import { WagmiConfig } from 'wagmi';

import Layout from './layouts/ChatLayout';
import XmtpProvider from './XmtpProvider';

type AppProps = {
  children?: React.ReactNode;
};

function App({ children }: AppProps) {
  const { colorMode } = useColorMode();
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        initialChain={env.defaultChain}
        theme={colorMode == 'light' ? lightTheme() : darkTheme()}
      >
        <XmtpProvider>
          <ChakraProvider theme={theme}>
            <Layout>{children}</Layout>
          </ChakraProvider>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
