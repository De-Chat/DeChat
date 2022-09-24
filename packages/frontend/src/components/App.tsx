import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { env } from '@shared/environment';
import { chains, wagmiClient } from '@shared/wagmiClient';
import theme from '@styles/theme';
import { WagmiConfig } from 'wagmi';

import Layout from './Layout';
import XmtpProvider from './XmtpProvider';
import { TablelandProvider } from './provider/TablelandProvider';

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
            <TablelandProvider>
              <Layout>{children}</Layout>
            </TablelandProvider>
          </XmtpProvider>
        </RainbowKitProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
