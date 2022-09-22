import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';
import { SuperfluidToken } from 'src/services/superFluidService';

export const useUpgradeCreateFlow = (
  wrapperSuperToken: SuperfluidToken,
  amount: BigNumber,
  sender: string,
  receiver: string,
  flowRate: string,
  userData?: string
) => {
  const [receipt, setReceipt] = useState<ethers.ContractReceipt | undefined>(
    undefined
  );

  const upgradeOp = wrapperSuperToken.upgradeOp(amount);
  const createFlowOp = wrapperSuperToken.createFlow(
    sender,
    receiver,
    flowRate,
    userData
  );

  wrapperSuperToken.execBatchCall([upgradeOp, createFlowOp]).then((receipt) => {
    setReceipt(receipt);
  });

  if (receipt) {
    return { done: true, receipt };
  }

  return { done: false, receipt: undefined };
};
