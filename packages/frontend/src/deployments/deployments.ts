import { env } from '@helpers/environment';

import { HardhatExport } from '../types/hardhat';

/**
 * Dynamically aggregating all deployments (addresses, abis)
 */
export type DeploymentsType = { [_: number]: Promise<HardhatExport> };
export const deployments: DeploymentsType = env.supportedChains.reduce(
  (acc: DeploymentsType, chainId: number) => ({
    ...acc,
    [chainId]: import(`src/deployments/${chainId}.json`),
  }),
  {}
);
