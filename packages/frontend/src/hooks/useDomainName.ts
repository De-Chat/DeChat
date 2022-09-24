import { useCallback, useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import { getEnsMainnet } from './useEns';
import { getUD } from './useUnsAddress';
import useUnsAvatar from './useUnsAvatar';
import useUnsName from './useUnsName';

type DomainName = {
  ensName: string | undefined;
  ensAddress: string | undefined;
  ensAvatar: string | undefined | null;

  udName: string | undefined | null;
  udAddress: string | undefined | null;
  udAvatar: string | undefined;
};

export const useDomainName = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [domainName, setDomainName] = useState<DomainName | undefined>();
  const [addressOrName, setAddressOrName] = useState<string>();

  const resolveDomainName = useCallback(
    (dn: string) => {
      if (dn !== addressOrName) {
        setAddressOrName(dn);
      }
    },
    [addressOrName]
  );

  useAsyncEffect(async () => {
    // debugger;
    const ensRes = await getEnsMainnet(addressOrName);
    const udRes = await getUD(addressOrName);
    setDomainName({
      ensName: ensRes?.ensName,
      ensAddress: ensRes?.address,
      ensAvatar: ensRes?.avatar,
      udName: udRes?.domain,
      udAddress: udRes?.address,
      udAvatar: udRes?.avatar,
    });
    setIsLoading(false);
  }, [addressOrName]);

  return { isLoading, domain: domainName, resolveDomainName };
};
