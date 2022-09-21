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

export const useCreateFramework = (provider: SupportedProvider) => {
  const [sf, setSf] = useState<Framework | undefined>(undefined);
  useEffect(() => {
    getSuperFluidFramework(provider).then((sf) => {
      setSf(sf);
    });
  }, [provider]);

  let loading = true;
  if (sf) {
    loading = false;
  }

  return { loading, framework: sf };
};
