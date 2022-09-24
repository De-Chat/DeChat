import { ethers } from 'ethers';
import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi';

const useEns = (addressOrName: string | undefined) => {
  const probableAddress =
    addressOrName?.startsWith('0x') && addressOrName?.length === 42
      ? addressOrName
      : undefined;
  const probableName = addressOrName?.endsWith('.eth')
    ? addressOrName
    : undefined;
  const { data: address, isLoading: loadingEnsAddress } = useEnsAddress({
    name: probableName,
  });
  const { data: ensName, isLoading: loadingEnsName } = useEnsName({
    address: probableAddress,
  });
  const { data: ensAvatar, isLoading: loadingEnsAvatar } = useEnsAvatar({
    addressOrName,
  });
  return {
    address: probableAddress || (address as string | undefined),
    ensName: probableName || (ensName as string | undefined),
    ensAvatar: ensAvatar as string | undefined,
    isLoading: loadingEnsName || loadingEnsAddress,
    isLoadingAvatar: loadingEnsAvatar,
  };
};

export default useEns;

export const getAlchemyMainnetProvider = () => {
  const apiKey = process.env.NEXT_PUBLIC_MUMBAI_API_KEY;
  const alchemyProvider = new ethers.providers.AlchemyProvider(
    { name: 'homestead', chainId: 1 },
    apiKey
  );
  return alchemyProvider;
};

export const getEnsMainnet = async (addressOrName: string | undefined) => {
  if (!addressOrName) {
    return;
  }

  const provider = getAlchemyMainnetProvider();
  let address: string | undefined;
  let ensName: string | undefined;

  if (addressOrName?.startsWith('0x')) {
    address = addressOrName;
    ensName = (await provider.lookupAddress(addressOrName)) ?? undefined;
  } else {
    ensName = addressOrName;

    const resolver = await provider.getResolver(addressOrName);
    address = await resolver?.getAddress();
  }

  let avatar: string | null = null;
  if (ensName) {
    avatar = await provider.getAvatar(ensName);
  }

  return {
    address,
    ensName,
    avatar,
  };
};
