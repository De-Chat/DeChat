import { Framework, WrapperSuperToken } from '@superfluid-finance/sdk-core';
import { useEffect, useState } from 'react';
const getWrappedSuperToken = async (
  framework: Framework,
  tokenAddress: string
) => {
  return await framework.loadWrapperSuperToken(tokenAddress);
};
export const useCreateWrapperSuperToken = (
  framework: Framework,
  tokenAddress: string
) => {
  const [sT, setST] = useState<WrapperSuperToken | undefined>(undefined);

  useEffect(() => {
    getWrappedSuperToken(framework, tokenAddress).then((st) => {
      setST(st);
    });
  });

  let loading = true;
  if (sT) {
    loading = true;
  }

  return { loading, superToken: sT };
};
