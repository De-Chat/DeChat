import { Flex } from '@chakra-ui/react';
import { LinkIcon } from '@heroicons/react/outline';
import { ChatIcon } from '@heroicons/react/outline';
import { ArrowSmRightIcon } from '@heroicons/react/solid';
import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';

import useXmtp from '../hooks/useXmtp';
import ConversationsList from './ConversationsList';
import Loader from './Loader';

const NavigationPanel = (): JSX.Element => {
  const { walletAddress } = useXmtp();

  return (
    <Flex grow={1} direction="column">
      {walletAddress ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton />
        </NoWalletConnectedMessage>
      )}
    </Flex>
  );
};

const NoWalletConnectedMessage: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Flex grow={1} justify="center" direction="column">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          No wallet connected
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
      {children}
    </Flex>
  );
};

const ConnectButton = (): JSX.Element => {
  return (
    <RKConnectButton.Custom>
      {({ openConnectModal }) => {
        return (
          <button
            onClick={openConnectModal}
            className="rounded border border-l-300 mx-auto my-4 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
          >
            <div className="flex items-center justify-center text-xs font-semibold px-4 py-1">
              Connect your wallet
              <ArrowSmRightIcon className="h-4" />
            </div>
          </button>
        );
      }}
    </RKConnectButton.Custom>
  );
};

const ConversationsPanel = (): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp();
  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    );
  }
  if (loadingConversations) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    );
  }

  return conversations && conversations.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList conversations={conversations} />
    </nav>
  ) : (
    <NoConversationsMessage />
  );
};

const NoConversationsMessage = () => {
  return (
    <Flex grow={1} justify="center" direction="column">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          There are no messages in this wallet
        </p>
      </div>
    </Flex>
  );
};

export default NavigationPanel;
