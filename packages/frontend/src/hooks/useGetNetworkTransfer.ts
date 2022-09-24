import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';

import { useCustomApolloClient } from './useCustomApolloClient';

const GET_TRANSFER = gql`
  query getTransfer($count: Int!, $from: Bytes!, $to: Bytes!) {
    transferETHs(
      first: $count
      where: { from: $from, to: $to }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      timestamp
      amount
    }
    transferERC20S(
      first: $count
      where: { from: $from, to: $to }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      timestamp
      amount
      contractAddress
    }
    transferERC721S(
      first: $count
      where: { from: $from, to: $to }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      timestamp
      tokenId
      contractAddress
    }
    transferERC1155S(
      first: $count
      where: { from: $from, to: $to }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      timestamp
      tokenId
      amount
      contractAddress
    }
  }
`;

export const useGetNetworkTransfer = (
  networkName: string,
  count: number,
  sender: string,
  recipient: string
) => {
  const client = useCustomApolloClient(networkName);

  const { loading, error, data, startPolling, stopPolling } = useQuery(
    GET_TRANSFER,
    {
      variables: { count, from: sender, to: recipient },
      client,
    }
  );

  return { loading, error, data, startPolling, stopPolling };
};

export const useGetNetworkTransferPoll = (
  networkName: string,
  pollInterval: number,
  count: number,
  sender: string,
  recipient: string
) => {
  const { loading, error, data, startPolling, stopPolling } =
    useGetNetworkTransfer(networkName, count, sender, recipient);

  useEffect(() => {
    startPolling(pollInterval);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling, pollInterval]);

  return { loading, error, data };
};
