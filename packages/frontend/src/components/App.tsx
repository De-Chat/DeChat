import XmtpProvider from './XmtpProvider';
import Layout from './Layout';

import '@rainbow-me/rainbowkit/styles.css';

import { WagmiConfig } from 'wagmi';
import { wagmiClient, chains } from '@shared/wagmiClient';
import { darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import theme from '@styles/theme';
import { env } from '@shared/environment';

type AppProps = {
  children?: React.ReactNode;
};

function App({ children }: AppProps) {
  const { colorMode } = useColorMode();
  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <RainbowKitProvider chains={chains} initialChain={env.defaultChain} theme={colorMode == 'light' ? lightTheme() : darkTheme()}>
          <XmtpProvider>
            <Layout>{children}</Layout>
          </XmtpProvider>
        </RainbowKitProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
