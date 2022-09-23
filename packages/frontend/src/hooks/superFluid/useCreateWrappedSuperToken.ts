import { Framework, WrapperSuperToken } from '@superfluid-finance/sdk-core';
import { useEffect, useState } from 'react';
const getWrappedSuperToken = async (
  framework: Framework,
  tokenAddress: string
) => {
  return await framework.loadWrapperSuperToken(tokenAddress);
};
export const createWrappedSuperToken = async (
  framework: Framework,
  tokenAddress: string
) => {
  return await getWrappedSuperToken(framework, tokenAddress)
};
