import { deployments } from '@deployments/deployments';
import { useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import { allChains, Chain, useNetwork } from 'wagmi';

import { env } from '../helpers/environment';
import { HardhatExportContracts } from '../types/hardhat';

export const useDeployments = () => {
  const { chain } = useNetwork();
  const [useDefaultChain, setUseDefaultChain] = useState<boolean>();
  const [contractsChain, setContractsChain] = useState<Chain>();
  const [contractsChainId, setContractsChainId] = useState<number>();
  const [contracts, setContracts] = useState<HardhatExportContracts>();

  const defaultChain: Chain | undefined = allChains.find(
    (chain) => env.defaultChain === chain.id
  );

  useAsyncEffect(async () => {
    const contractsChain = !chain || chain.unsupported ? defaultChain : chain;

    if (contractsChain) {
      const contracts = (await deployments[contractsChain.id]).contracts;
      setUseDefaultChain(useDefaultChain);
      setContractsChain(contractsChain);
      setContractsChainId(contractsChain.id);
      setContracts(contracts);
    } else {
      setUseDefaultChain(undefined);
      setContractsChain(undefined);
      setContractsChainId(undefined);
      setContracts(undefined);
    }
  }, [chain]);

  return {
    useDefaultChain,
    contractsChain,
    contractsChainId,
    contracts,
  };
};
