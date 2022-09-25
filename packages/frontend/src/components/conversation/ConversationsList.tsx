import { Flex } from '@chakra-ui/react';
import { useUserContact } from '@hooks/user-contact/useUserContact';
import { Message } from '@xmtp/xmtp-js';
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import { XmtpContext } from '../../contexts/xmtp';
import { classNames, formatDate, truncate } from '../../helpers';
import useConversation from '../../hooks/useConversation';
import useEns from '../../hooks/useEns';
import Address from '../commons/Address';
import Avatar from '../commons/Avatar';

type ConversationsListProps = {
  conversations: Conversation[];
};

type ConversationTileProps = {
  conversation: Conversation;
  isSelected: boolean;
  onClick?: () => void;
};

const getLatestMessage = (messages: Message[]): Message | null =>
  messages.length ? messages[messages.length - 1] : null;

const ConversationTile = ({
  conversation,
  isSelected,
  onClick,
}: ConversationTileProps): JSX.Element | null => {
  const { messages } = useConversation(conversation.peerAddress);
  const latestMessage = getLatestMessage(messages);
  const { ensName } = useEns(conversation.peerAddress);

  const path = `/dm/${ensName || conversation.peerAddress}`;
  if (!latestMessage) {
    return null;
  }
  return (
    <Link href={path} key={conversation.peerAddress}>
      <a onClick={onClick}>
        <Flex
          h={20}
          py={2}
          px={4}
          mx="auto"
          alignItems="center"
          borderRadius="lg"
          _hover={{ backgroundColor: 'secondary' }}
          backgroundColor={isSelected ? 'secondary' : 'initial'}
          className={classNames(
            'md:max-w-sm',
            'space-y-2',
            'space-y-0',
            'space-x-4'
          )}
        >
          <Avatar addressOrName={conversation.peerAddress} />
          <div className="py-4 sm:text-left text w-full">
            <div className="grid-cols-2 grid">
              <Address
                address={conversation.peerAddress}
                className="text-lg md:text-md font-bold place-self-start"
              />
              <span
                className={classNames(
                  'text-lg md:text-sm place-self-end',
                  isSelected ? 'text-n-200' : 'text-n-300'
                )}
              >
                {formatDate(latestMessage?.sent)}
              </span>
            </div>
            <p
              className={classNames(
                'text-[13px] md:text-sm font-normal text-ellipsis mt-0',
                isSelected ? 'text-n-200' : 'text-n-300'
              )}
            >
              {latestMessage && truncate(latestMessage.content, 75)}
            </p>
          </div>
        </Flex>
      </a>
    </Link>
  );
};

const ConversationsList = ({
  conversations,
}: ConversationsListProps): JSX.Element => {
  const router = useRouter();
  const { getMessages } = useContext(XmtpContext);
  const peerAddressOrName = router.query.peerAddressOrName as string;
  const { address, ensName } = useEns(peerAddressOrName);

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation
  ): number => {
    const convoAMessages = getMessages(convoA.peerAddress);
    const convoBMessages = getMessages(convoB.peerAddress);
    const convoALastMessageDate =
      getLatestMessage(convoAMessages)?.sent || new Date();
    const convoBLastMessageDate =
      getLatestMessage(convoBMessages)?.sent || new Date();
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1;
  };
  return (
    <div>
      {conversations &&
        conversations.sort(orderByLatestMessage).map((convo) => {
          const isSelected =
            convo.peerAddress === address || convo.peerAddress === ensName;
          return (
            <ConversationTile
              key={convo.peerAddress}
              conversation={convo}
              isSelected={isSelected}
            />
          );
        })}
    </div>
  );
};

export default ConversationsList;
