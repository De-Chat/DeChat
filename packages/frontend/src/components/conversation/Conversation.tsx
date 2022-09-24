import { Flex } from '@chakra-ui/react';
import { useGetAllTransfer } from '@hooks/useGetAllTransfer';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';

import useConversation from '../../hooks/useConversation';
import useEns from '../../hooks/useEns';
import useXmtp from '../../hooks/useXmtp';
import Loader from '../commons/Loader';
import { MessageComposer, MessagesList } from '.';
import { MessageTileProps } from './MessagesList';

type ConversationProps = {
  peerAddressOrName: string;
};

const Conversation = ({
  peerAddressOrName,
}: ConversationProps): JSX.Element => {
  const { walletAddress, client } = useXmtp();
  const messagesEndRef = useRef(null);
  const scrollToMessagesEndRef = useCallback(() => {
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef]);

  const { address: peerAddress } = useEns(peerAddressOrName);

  // prepare XMTP messages
  const { messages, sendMessage, loading } = useConversation(
    peerAddress as string,
    scrollToMessagesEndRef
  );

  // TODO: change here to peerAddress, walletAddress
  const transactions = useGetAllTransfer(
    100,
    walletAddress || '',
    peerAddress || ''
  );

  // process XMTP messages and Graph transactions
  const { address } = useAccount();
  const allMessages: MessageTileProps[] = useMemo(() => {
    const textMessages = messages.map((m) => ({
      type: 'message',
      message: m,
      isSender: m.senderAddress == address,
    }));

    const txMessages = transactions.map((tx) => ({
      type: 'transaction',
      message: {
        senderAddress: tx.from,
        sent: new Date(tx.timestamp * 1000),
        content: tx, // just to follow xmtp message.content format
      },
      isSender: tx.senderAddress == address,
    }));

    return [...textMessages, ...txMessages].sort(
      (a, b) => (a.message as any).sent - (b.message as any).sent
    );
  }, [messages, transactions]);

  const hasMessages = messages.length > 0;
  useEffect(() => {
    if (!hasMessages) return;
    const initScroll = () => {
      scrollToMessagesEndRef();
    };
    initScroll();
  }, [peerAddressOrName, hasMessages, scrollToMessagesEndRef]);

  if (!peerAddressOrName || !walletAddress || !client) {
    return <div />;
  }
  if (loading && !messages?.length) {
    return (
      <Loader
        headingText="Loading messages..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    );
  }

  return (
    <Flex direction="column" height="full" bgColor="secondary">
      <MessagesList messagesEndRef={messagesEndRef} messages={allMessages} />
      {walletAddress && (
        <MessageComposer peerAddress={peerAddress || ''} onSend={sendMessage} />
      )}
    </Flex>
  );
};

export default Conversation;
