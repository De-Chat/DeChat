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

import Layout from './Layout';
import XmtpProvider from './XmtpProvider';

type AppProps = {
  children?: React.ReactNode;
};

function App({ children }: AppProps) {
  const { colorMode } = useColorMode();
  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <RainbowKitProvider
          chains={chains}
          initialChain={env.defaultChain}
          theme={colorMode == 'light' ? lightTheme() : darkTheme()}
        >
          <XmtpProvider>
            <Layout>{children}</Layout>
          </XmtpProvider>
        </RainbowKitProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
