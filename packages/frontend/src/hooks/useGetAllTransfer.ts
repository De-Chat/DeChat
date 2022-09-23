import { ApolloError } from '@apollo/client';

import networkSubgraph from '../../networkSubgraph.json';
import {
  useGetNetworkTransfer,
  useGetNetworkTransferPoll,
} from './useGetNetworkTransfer';

export const useGetAllTransfer = (
  count: number,
  sender: string,
  recipient: string
) => {
  const loadings: boolean[] = [];
  const errors: (ApolloError | undefined)[] = [];
  const dataMap: Map<string, any[]> = new Map();

  Object.keys(networkSubgraph).forEach((key: string) => {
    const { loading, error, data } = useGetNetworkTransferPoll(
      key,
      1000,
      count,
      sender,
      recipient
    );

    loadings.push(loading);
    errors.push(error);
    dataMap.set(key, data);
  });

  return {
    loading: loadings.every((loading) => {
      return loading === true;
    }),
    errors,
    data: dataMap,
  };
};
