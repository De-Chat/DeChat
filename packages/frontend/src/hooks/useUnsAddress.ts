import { Resolution } from '@unstoppabledomains/resolution';
import { useState } from 'react';

const useUnsAddress = (domain: string) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const resolution = new Resolution();

  resolution
    .addr(domain, 'eth')
    .then((add) => {
      setAddress(add);
    })
    .catch((err) => console.error(address, 'does not resolve to any domain'));

  return address;
};

export default useUnsAddress;

export const getUD = async (addressOrName: string | undefined) => {
  if (!addressOrName) {
    return;
  }

  const resolution = new Resolution();

  let address: string | null = null;
  let domain: string | null;
  let avatar: string | undefined;

  if (addressOrName?.startsWith('0x')) {
    address = addressOrName;
    domain = await resolution.reverse(addressOrName);
  } else {
    domain = addressOrName;
    try {
      address = await resolution.addr(domain, 'eth');
    } catch {
      domain = null;
    }
  }

  if (domain) {
    avatar = (await resolution.tokenURIMetadata(domain))?.image_data;
  }

  return {
    address,
    domain,
    avatar,
  };
};

// export const getEnsMainnet = async (addressOrName: string | undefined) => {
//     if (!addressOrName) {
//       return;
//     }

//     const provider = getAlchemyMainnetProvider();
//     let address: string | undefined;
//     let ensName: string | undefined;

//     if (addressOrName?.startsWith('0x')) {
//       address = addressOrName;
//       ensName = (await provider.lookupAddress(addressOrName)) ?? undefined;
//     } else {
//       ensName = addressOrName;

//       const resolver = await provider.getResolver(addressOrName);
//       address = await resolver?.getAddress();
//     }

//     let avatar: string | null = null;
//     if (ensName) {
//       avatar = await provider.getAvatar(ensName);
//     }

//     return {
//       address,
//       ensName,
//       avatar,
//     };
//   };
