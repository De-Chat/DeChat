import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { env } from '@helpers/environment';
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chains, wagmiClient } from '@services/wagmiClient';
import theme from '@styles/theme';
import { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';

import { SwitchingLayout } from './layouts/SwitchingLayout';
import { TablelandProvider } from './provider/TablelandProvider';
import XmtpProvider from './provider/XmtpProvider';

const App: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        initialChain={env.defaultChain}
        theme={colorMode == 'light' ? lightTheme() : darkTheme()}
      >
        <XmtpProvider>
          <TablelandProvider>
            <ChakraProvider theme={theme}>
              <SwitchingLayout>{children}</SwitchingLayout>
            </ChakraProvider>
          </TablelandProvider>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
