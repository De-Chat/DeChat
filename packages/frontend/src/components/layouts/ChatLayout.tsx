import { Flex, IconButton } from '@chakra-ui/react';
import BackArrow from '@components/commons/BackArrow';
import { TitleText } from '@components/commons/TitleText';
import UserMenu from '@components/commons/UserMenu';
import XmtpInfoPanel from '@components/commons/XmtpInfoPanel';
import { useDomainName } from '@hooks/useDomainName';
import { useUserContact } from '@hooks/user-contact/useUserContact';
import useXmtp from '@hooks/useXmtp';
import AddContact from '@public/chat-icons/add-contact.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getEpnsUserSubscriptions,
  isUserSubscribed,
  optInToChannel,
  optOutToChannel,
} from 'src/services/epnsService';
import { useDisconnect, useSigner } from 'wagmi';

import {
  ChatListView,
  ConversationView,
  RecipientControl,
} from '../conversation';
import NavigationPanel from '../conversation/NavigationPanel';

import Unlock from '@components/commons/Unlock';

const NavigationSidebarContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
    <div className="flex flex-col flex-grow md:border-r md:border-gray-800 overflow-y-auto">
      {children}
    </div>
  </aside>
);

const NavigationHeaderLayout: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => (
  <Flex
    height="72px"
    alignItems="center"
    justify="space-between"
    shrink="0"
    paddingX="4"
    borderBottomWidth="1px"
    borderStyle="solid"
    borderBottomColor="secondary"
  >
    <Link href="/" passHref={true}>
      <TitleText>DeChat</TitleText>
    </Link>
    {children}
  </Flex>
);

const TopBarLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="sticky top-0 z-10 flex-shrink-0 flex bg-zinc-50 border-b border-gray-200 md:border-0">
    {children}
  </div>
);

const ConversationLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [peerAddressOrName, setPeerAddressOrName] = useState<string>();

  useEffect(() => {
    const curAddress = router.query.peerAddressOrName;
    if (curAddress && typeof curAddress === 'string') {
      setPeerAddressOrName(curAddress);
    }
  }, [router]);

  const handleSubmit = async (newPeerAddressOrName: string) => {
    setPeerAddressOrName(newPeerAddressOrName);
    router.push(newPeerAddressOrName ? `/dm/${newPeerAddressOrName}` : '/dm/');
  };

  const handleBackArrowClick = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <>
      <TopBarLayout>
        <div className="md:hidden flex items-center ml-3">
          <BackArrow onClick={handleBackArrowClick} />
        </div>
        <RecipientControl
          peerAddressOrName={peerAddressOrName}
          onSubmit={handleSubmit}
        />
      </TopBarLayout>
      {children}
    </>
  );
};

export const ChatLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const {
    connect: connectXmtp,
    disconnect: disconnectXmtp,
    walletAddress,
    client,
  } = useXmtp();

  const { disconnect } = useDisconnect({
    onSettled() {
      disconnectXmtp();
    },
  });
  const { data: signer } = useSigner();

  const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const prevSigner = usePrevious(signer);

  useEffect(() => {
    if ((!signer && prevSigner) || signer !== prevSigner) {
      disconnectXmtp();
    }
    if (!signer || signer === prevSigner) return;

    const connect = async () => {
      console.log('signer', signer);
      if (signer) {
        connectXmtp(signer);
      }
    };
    connect();
  }, [signer, prevSigner, connectXmtp, disconnectXmtp]);

  // ---- epns

  // create state components to fetch all the notifications.
  const [isSubscribed, setIsSubscribed] = useState(false);
  // create handler to subscribe to channel
  const handleOptInOptOut = async () => {
    if (!walletAddress) return;
    if (!isSubscribed) {
      const res = await optInToChannel(signer, walletAddress);
      if (res?.status === 'success') {
        setIsSubscribed(true);
      }
    } else {
      const res2 = await optOutToChannel(signer, walletAddress);
      if (res2?.status === 'success') {
        setIsSubscribed(false);
      }
    }
  };

  useEffect(() => {
    console.log(`walletAddress useEffect: ${walletAddress}`);
    if (!walletAddress) return;
    // get userSubscription status
    getEpnsUserSubscriptions(walletAddress).then((subscriptions) => {
      console.log('epns subscriptions', subscriptions);
    });
    isUserSubscribed(walletAddress).then((res) => {
      console.log('isUserSubscribed useEffect', res);
      setIsSubscribed(res);
    });
  }, [walletAddress]);

  return (
    <>
      <ChatListView>
        <NavigationSidebarContainer>
          <Unlock />
          <NavigationHeaderLayout>
            {walletAddress && client && (
              <IconButton
                aria-label="Add new chat"
                icon={<img src={AddContact} />}
                size="xs"
                variant="unstyled"
              />
            )}
            <button
              className="inline-flex items-center h-7 md:h-6 px-4 py-1 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
              onClick={handleOptInOptOut}
            >
              <img src="/full_bell.png" width="24" height="24" />
              {!isSubscribed ? 'Opt In' : 'Opt Out'}
            </button>
          </NavigationHeaderLayout>
          <NavigationPanel />
          <UserMenu onDisconnect={disconnect} />
        </NavigationSidebarContainer>
      </ChatListView>
      <ConversationView>
        {walletAddress && client ? (
          <ConversationLayout>{children}</ConversationLayout>
        ) : (
          <XmtpInfoPanel />
        )}
      </ConversationView>
    </>
  );
};
