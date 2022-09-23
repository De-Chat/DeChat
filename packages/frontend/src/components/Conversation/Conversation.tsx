import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';

import useConversation from '../../hooks/useConversation';
import useEns from '../../hooks/useEns';
import useXmtp from '../../hooks/useXmtp';
import Loader from '../Loader';
import { MessageComposer, MessagesList } from '.';
import { Transaction } from './MessageRenderer';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef]);

  const { address: peerAddress } = useEns(peerAddressOrName);

  const { messages, sendMessage, loading } = useConversation(
    peerAddress as string,
    scrollToMessagesEndRef
  );

  const { address } = useAccount();
  const allMessages: MessageTileProps[] = useMemo(() => {
    const textMessages = messages.map((m) => ({
      type: 'message',
      message: m,
      isSender: m.senderAddress == address,
    }));
    const transactions: Transaction[] = [
      {
        senderAddress: address || '0x000',
        sent: new Date(),
        content: {
          txHash: '0x123',
          amount: 1234,
          token: 'USDT',
        },
      },
    ];
    const txMessages = transactions.map((tx) => ({
      type: 'transaction',
      message: tx,
      isSender: tx.senderAddress == address,
    }));

    return [...textMessages, ...txMessages];
  }, [messages]);

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
    <main className="flex flex-col flex-1 bg-white h-screen">
      <MessagesList messagesEndRef={messagesEndRef} messages={allMessages} />
      {walletAddress && <MessageComposer onSend={sendMessage} />}
    </main>
  );
};

export default Conversation;
