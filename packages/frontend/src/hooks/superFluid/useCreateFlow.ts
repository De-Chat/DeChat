import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';
import { SuperfluidToken } from 'src/services/superFluidService';

export const useCreateFlow = (
  wrapperSuperToken: SuperfluidToken,
  sender: string,
  receiver: string,
  flowRate: string,
  userData?: string
) => {
  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionResponse | undefined
  >(undefined);

  const createFlowOp = wrapperSuperToken.createFlow(
    sender,
    receiver,
    flowRate,
    userData
  );
  createFlowOp
    .exec(wrapperSuperToken.getSigner())
    .then((receipt: ethers.providers.TransactionResponse) => {
      setReceipt(receipt);
    });

  if (receipt) {
    return { done: true, receipt };
  }

  return { done: false, receipt: undefined };
};
