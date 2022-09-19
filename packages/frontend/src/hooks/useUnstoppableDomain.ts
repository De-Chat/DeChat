import { Resolution } from '@unstoppabledomains/resolution';
import { useState } from 'react';

const useUnstoppableDomain = (walletAddress : string) => {

  const [domain, setDomain] = useState<string | null>(null);
  const resolution = new Resolution();

  resolution
    .reverse(walletAddress)
    .then((domain) => {setDomain(domain)})
    .catch((err) => console.log(walletAddress, 'does not resolve to any domain'));

  return domain;
}

export default useUnstoppableDomain;