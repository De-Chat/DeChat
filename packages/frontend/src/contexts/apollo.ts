import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createContext } from 'react';

import networkSubgraph from '../../networkSubgraph.json';

export class ApolloTheGraphClient {
  private clients: Map<string, ApolloClient<any>> = new Map();
  constructor() {
    Object.keys(networkSubgraph).forEach((key: string) => {
      const url = networkSubgraph[key as keyof typeof networkSubgraph];
      this.clients.set(
        key,
        new ApolloClient({
          uri: `/api/subgraph-dechat-${key}`,
          cache: new InMemoryCache(),
          name: key,
        })
      );
    });
  }

  public getNetworkGraphClient<T>(networkName: string): ApolloClient<T> {
    if (!this.clients.has(networkName)) {
      throw new Error('not found');
    }
    return this.clients.get(networkName) as ApolloClient<T>;
  }
}

export const ApolloTheGraphClientContext = createContext<ApolloTheGraphClient>(
  new ApolloTheGraphClient()
);
