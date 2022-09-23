import { useContext } from 'react';
import { ApolloTheGraphClientContext } from 'src/contexts/apollo';

export const useCustomApolloClient = (networkName: string) => {
  const context = useContext(ApolloTheGraphClientContext);
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider');
  }
  return context.getNetworkGraphClient(networkName);
};
