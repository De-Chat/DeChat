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
import { PropsWithChildren, useMemo } from 'react';
import { WagmiConfig } from 'wagmi';

import { SwitchingLayout } from './layouts/SwitchingLayout';
import { UserContactProvider } from './provider/UserContactProvider';
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
          <UserContactProvider>
            <ChakraProvider theme={theme}>
              <SwitchingLayout>{children}</SwitchingLayout>
            </ChakraProvider>
          </UserContactProvider>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
