import { SuperfluidToken } from '@services/superFluidService';
import { useEffect, useState } from 'react';

export const useGetNetFlow = (
  superFluidToken: SuperfluidToken,
  account: string
) => {
  const [netFlow, setNetFlow] = useState<string>();

  useEffect(() => {
    const asyncFn = async () => {
      const netFlow = await superFluidToken.getNetFlow(account);
      setNetFlow(netFlow);
    }

    asyncFn();
  }, [superFluidToken, account]);

  if (netFlow) {
    return { loading: false, netFlow };
  } else {
    return { loading: true, netFlow: '' };
  }
};
