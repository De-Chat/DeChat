import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

declare type SupportedProvider = ethers.providers.Provider;

export const getSuperFluidFramework = async (
  provider: SupportedProvider
): Promise<Framework> => {
  const chainId = (await provider.getNetwork()).chainId;

  return await Framework.create({
    chainId: chainId,
    provider: provider,
  });
};

export const createFramework = async (provider: SupportedProvider) => {
  return await getSuperFluidFramework(provider);
};
