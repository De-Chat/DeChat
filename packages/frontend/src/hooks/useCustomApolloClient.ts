import { ApolloTheGraphClientContext } from '@contexts/apollo';
import { useContext } from 'react';

export const useCustomApolloClient = (networkName: string) => {
  const context = useContext(ApolloTheGraphClientContext);
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider');
  }
  return context.getNetworkGraphClient(networkName);
};
