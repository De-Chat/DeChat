import { ethers } from 'ethers';
import { useState } from 'react';
import { SuperfluidToken } from 'src/services/superFluidService';

export const useDeleteFlow = (
  wrapperSuperToken: SuperfluidToken,
  sender: string,
  receiver: string,
  flowRate: string,
  userData?: string
) => {
  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionResponse | undefined
  >(undefined);

  const deleteFlowOp = wrapperSuperToken.deleteFlow(
    sender,
    receiver,
    flowRate,
    userData
  );
  deleteFlowOp.exec(wrapperSuperToken.getSigner()).then((receipt) => {
    setReceipt(receipt);
  });

  if (receipt) {
    return { done: true, receipt };
  }

  return { done: false, receipt: undefined };
};
