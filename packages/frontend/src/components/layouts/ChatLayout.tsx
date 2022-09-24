import { Flex, IconButton } from '@chakra-ui/react';
import { getEnsMainnet } from '@hooks/useEns';
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
} from 'react';
import { useUserContact } from 'src/hooks/user-contact/useUserContact';
import { useDisconnect, useSigner } from 'wagmi';

import BackArrow from '../BackArrow';
import { TitleText } from '../commons/TitleText';
import {
  ChatListView,
  ConversationView,
  RecipientControl,
} from '../Conversation';
import NavigationPanel from '../NavigationPanel';
import UserMenu from '../UserMenu';
import XmtpInfoPanel from '../XmtpInfoPanel';

const NavigationSidebarContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
    <div
      className="flex flex-col flex-grow md:border-r md:border-gray-200 overflow-y-auto"
      style={{ backgroundColor: 'var(--chakra-colors-secondaryDark)' }}
    >
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
  const peerAddressOrName = router.query.peerAddressOrName as string;

  const handleSubmit = useCallback(
    async (peerAddressOrName: string) => {
      router.push(peerAddressOrName ? `/dm/${peerAddressOrName}` : '/dm/');
    },
    [router]
  );

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

const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const {
    connect: connectXmtp,
    disconnect: disconnectXmtp,
    walletAddress,
    client,
  } = useXmtp();
  const router = useRouter();
  let contact = useUserContact();

  const { disconnect } = useDisconnect({
    onSettled() {
      disconnectXmtp();
      router.push('/');
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
    const connecttoTableland = async (signer: any) => {
      if (contact) {
        const tableId = await contact.service.connectToTableland(signer);
        console.log(`tableId: ${tableId}`);
        return tableId;
      }
    };
    if ((!signer && prevSigner) || signer !== prevSigner) {
      disconnectXmtp();
    }
    if (!signer || signer === prevSigner) return;
    const connect = async () => {
      const prevAddress = await prevSigner?.getAddress();
      const address = await signer.getAddress();
      if (address === prevAddress) return;
      const tableId = await connecttoTableland(signer);
      contact?.setUserContactTableId(tableId);
      connectXmtp(signer);

      // load ens data
      const ens = await getEnsMainnet('0x7D7b6DFCF3287Feb5BC7E88dec12323f5b29e893');
      console.log(`ens: ${JSON.stringify(ens)}`);

      // load from tableland
      debugger;
      const xx = await contact?.service.loadContacts(tableId!);
      console.log(xx);
    };
    connect();
  }, [signer, prevSigner, connectXmtp, disconnectXmtp, contact]);

  return (
    <>
      <ChatListView>
        <NavigationSidebarContainer>
          <NavigationHeaderLayout>
            {walletAddress && client && (
              <IconButton
                aria-label="Add new chat"
                icon={<img src={AddContact} />}
                size="xs"
                variant="unstyled"
              />
            )}
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

export default Layout;
