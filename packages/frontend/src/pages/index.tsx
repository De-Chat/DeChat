import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';


/**
 * The default page nextjs should land on.
 * As this is a chat app, this should be the first place it lands on.
 */
const ChatPage: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  if (!isConnected) {
    router.push('/login');
  }

  return <div />;
};

export default ChatPage;
