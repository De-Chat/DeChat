import { SuperfluidToken } from '@services/superFluidService';
import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';

export const upgradeCreateFlow = async (
  wrapperSuperToken: SuperfluidToken,
  upgradeAmount: BigNumber,
  sender: string,
  receiver: string,
  flowRate: string,
  userData?: string
) => {
  const upgradeOp = wrapperSuperToken.upgradeOp(upgradeAmount);
  const createFlowOp = wrapperSuperToken.createFlow(
    sender,
    receiver,
    flowRate,
    userData
  );

  const receipt = await wrapperSuperToken.execBatchCall([
    upgradeOp,
    createFlowOp,
  ]);
  return receipt;
};
