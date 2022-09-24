import { Login } from '@components/Login';
import { useServiceManager } from '@hooks/useServiceManager';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

import { ChatLayout } from './ChatLayout';

/**
 * Conditionally apply layout according to login state.
 */
export const SwitchingLayout: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const router = useRouter();
  const { address, isConnected, isReady } = useServiceManager();

  // Used to prevent unauthorized url access and confusing urls
  if (router.pathname !== '/' && !router.pathname.startsWith('/dm')) {
    router.replace('/');
  }

  // If already logged in, directly render here
  if (isReady) {
    return <ChatLayout>{children}</ChatLayout>;
  }

  // If not logged in navigate them to the login page.
  return (
    <Login address={address} isConnected={isConnected} isReady={isReady} />
  );
};
