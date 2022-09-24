import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { allChains, Chain, chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { env } from '../helpers/environment';

/**
 * Wagmi.sh Configuration (https://wagmi.sh/docs)
 */

export const defaultChain: Chain | undefined = allChains.find(
  (chain) => env.defaultChain === chain.id
);

export const isChainSupported = (chainId?: number): boolean => {
  return chainId && env.supportedChains.includes(chainId);
};
export const supportedChains: Chain[] = allChains.filter((chain) =>
  isChainSupported(chain.id)
);

export const getRpcUrl = (chainId: number): string => {
  return env.rpcUrls[chainId as keyof typeof env.rpcUrls];
};

export const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Dechat',
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
