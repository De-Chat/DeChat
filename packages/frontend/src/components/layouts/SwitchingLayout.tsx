import LoginPage from '@components/Login';
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
  const { isConnected, address } = useAccount();

  if (router.pathname !== '/') {
    router.replace('/');
  }

  // If already logged in, directly render here
  if (isConnected && address !== undefined) {
    return <ChatLayout>{children}</ChatLayout>;
  }

  // If not logged in navigate them to the login page.
  return <LoginPage />;
};