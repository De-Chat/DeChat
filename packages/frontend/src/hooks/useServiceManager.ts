import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useUserContact } from './user-contact/useUserContact';

export const useServiceManager = () => {
  const { address, isConnected } = useAccount();
  const { currentContacts, initializeUserContact, loadContacts } =
    useUserContact();

  useEffect(() => {
    const asyncFn = async () => {
      if (isConnected) {
        await initializeUserContact();
      }
      if (currentContacts === undefined) {
        await loadContacts();
      }
    };

    asyncFn();
  }, [isConnected, currentContacts, initializeUserContact, loadContacts]);

  return {
    address,
    isConnected,
    isReady: isConnected && currentContacts !== undefined,
  };
};
