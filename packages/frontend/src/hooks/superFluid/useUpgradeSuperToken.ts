import {
  getSuperFluidFramework,
  getWrappedSuperToken,
  SuperfluidToken,
} from '@services/superFluidService';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

// export const useUpgradeSuperToken = (
//   superTokenAddr: string,
//   provider: ethers.providers.Provider,
//   signer: ethers.Signer,
//   amount: BigNumber
// ) => {
//   const [superFluidToken, setSuperfluidToken] = useState<
//     SuperfluidToken | undefined
//   >();

//   const [done, setDone] = useState<boolean>(false);

//   useEffect(() => {
//     // TODO: can refactor this part
//     getSuperFluidFramework(provider).then((sf) => {
//       getWrappedSuperToken(sf, superTokenAddr).then((token) => {
//         setSuperfluidToken(new SuperfluidToken(sf, signer, token));
//       });
//     });
//   }, [superTokenAddr, provider, signer]);

//   if (superFluidToken) {
//     const upgradeOp = superFluidToken.upgradeOp(amount);
//     upgradeOp.exec(signer).then(() => {
//       setDone(true);
//     });

//     return done;
//   }
// };

export const useUpgradeSuperToken = (
  wrapperSuperToken: SuperfluidToken,
  amount: BigNumber
) => {
  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionResponse | undefined
  >(undefined);

  const upgradeOp = wrapperSuperToken.upgradeOp(amount);
  upgradeOp.exec(wrapperSuperToken.getSigner()).then((receipt) => {
    setReceipt(receipt);
  });

  if (receipt) {
    return { done: true, receipt };
  }

  return { done: false, receipt: undefined };
};
