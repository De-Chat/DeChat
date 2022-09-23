import { ApolloError } from '@apollo/client';
import { useMemo } from 'react';

import networkSubgraph from '../../networkSubgraph.json';
import { useGetNetworkTransfer } from './useGetNetworkTransfer';

export const useGetAllTransfer = (
  count: number,
  userA: string,
  userB: string
) => {
  const { data: a2bTx, loading: a2bLoading } = useGetAllDirectedTransfer(
    count,
    userA,
    userB
  );
  const { data: b2aTx, loading: b2aLoading } = useGetAllDirectedTransfer(
    count,
    userB,
    userA
  );
  const flattenedA2bTx = useMemo(() => flattenTxs(a2bTx), [a2bTx]);
  const flattenedB2aTx = useMemo(() => flattenTxs(b2aTx), [b2aTx]);
  const txs = useMemo(
    () => sortTxs([...flattenedA2bTx, ...flattenedB2aTx]),
    [flattenedA2bTx, flattenedB2aTx]
  );
  return txs;
};

export const useGetAllDirectedTransfer = (
  count: number,
  sender: string,
  recipient: string
) => {
  const loadings: boolean[] = [];
  const errors: (ApolloError | undefined)[] = [];
  const dataMap: Map<string, any[]> = new Map();

  Object.keys(networkSubgraph).forEach((key: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading, error, data } = useGetNetworkTransfer(
      key,
      '',
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

// subgraph return
// {
//   "data": {
//     "transferETHs": [
//       {
//         "id": "0xdd1f27264784e07b122622968de6473fe2983623d4a19086ffea8ecb0c505c6d",
//         "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//         "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//         "timestamp": "1663401336",
//         "amount": "10000000000000"
//       }
//     ],
//     "transferERC20S": [],
//     "transferERC721S": [],
//     "transferERC1155S": []
//   }
// }

// sample output from flattenTxs()
// [
//   {
//       "transferType": "transferETHs",
//       "__typename": "TransferETH",
//       "id": "0xdd1f27264784e07b122622968de6473fe2983623d4a19086ffea8ecb0c505c6d",
//       "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//       "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//       "sent": "1663401336",
//       "amount": "10000000000000" // eth, erc20, 1155
//       "contractAddress" // erc20, 721, 1155
//       "tokenId" // erc721, 1155
//   }
// ]
// TODO: parse amout and chain
const flattenTxs = (data: Map<string, Record<string, any>>) => {
  let flattenedTxs = [];
  // flatten transactions
  for (const network of data.keys()) {
    const allTypeTransfers = data.get(network);
    for (const transferType in allTypeTransfers) {
      const txs: any[] = allTypeTransfers[transferType];
      let formattedObjs = txs.map((tx: any) => ({
        transferType,
        chain: network,
        ...tx,
      }));
      flattenedTxs.push(...formattedObjs);
    }
  }

  return flattenedTxs;
};

// sort transactions
const sortTxs = (data: any[]) => {
  return data.sort(
    (a, b) => new Date(a.sent).getTime() - new Date(b.sent).getTime()
  );
};
