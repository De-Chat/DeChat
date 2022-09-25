import { Resolution } from '@unstoppabledomains/resolution';
import { useState } from 'react';

const useUnsName = (walletAddress: string) => {
  const [domain, setDomain] = useState<string | null>(null);
  const resolution = new Resolution();

  resolution
    .reverse(walletAddress)
    .then((domain) => {
      setDomain(domain);
    })
    .catch((err) =>
      console.error(walletAddress, 'does not resolve to any domain')
    );

  return domain;
};

export default useUnsName;
