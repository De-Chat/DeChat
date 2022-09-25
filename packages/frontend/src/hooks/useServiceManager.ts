import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useUserContact } from './user-contact/useUserContact';
import useXmtp from './useXmtp';

// Essentially, make sure everything init once.
export const useServiceManager = () => {
  const { address, isConnected } = useAccount();
  const { currentContacts, initializeUserContact, loadContacts } =
    useUserContact();
  const { client, connect } = useXmtp();

  // Initialize tableland and thus user contact tables
  useEffect(() => {
    const asyncFn = async () => {
      if (isConnected) {
        await initializeUserContact();
      }

      if (currentContacts === undefined) {
        await loadContacts();
      } else if (client === undefined) {
        // Initialize xmtp client
        await connect();
      }
    };

    asyncFn();
  }, [
    isConnected,
    currentContacts,
    initializeUserContact,
    loadContacts,
    client,
    connect,
  ]);

  return {
    address,
    isConnected,
    isReady:
      isConnected && currentContacts !== undefined && client !== undefined,
  };
};
