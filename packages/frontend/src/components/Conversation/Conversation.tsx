import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import useXmtp from '../../hooks/useXmtp';
import useConversation from '../../hooks/useConversation';
import { MessagesList, MessageComposer } from '.';
import Loader from '../Loader';
import useEns from '../../hooks/useEns';
import { useAccount } from 'wagmi';
import { MessageTileProps } from './MessagesList';
import { Transaction } from './MessageRenderer';
import { useGetAllTransfer } from 'src/hooks/useGetAllTransfer';

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

  // prepare XMTP messages
  const { messages, sendMessage, loading } = useConversation(
    peerAddress as string,
    scrollToMessagesEndRef
  );
  // prepare Graph transactions
  const transactions = useGetAllTransfer(100, walletAddress, walletAddress)
  // console.log('test getGraph: ', tx)
  // const transactions: Transaction[] = useMemo(() => {
  //   return [{
  //     senderAddress: address || "0x000",
  //     sent: new Date(),
  //     content: {
  //       txHash: "0x123",
  //       amount: 1234,
  //       token: "USDT"
  //     }
  //   }]
  // }, [])

  // process XMTP messages and Graph transactions
  const { address } = useAccount();
  const allMessages: MessageTileProps[] = useMemo(() => {
    const textMessages = messages.map(m => ({
      type: 'message',
      message: m,
      isSender: m.senderAddress == address
    }))

    const txMessages = transactions.map(tx => ({
      type: 'transaction',
      message: {
        senderAddress: tx.from,
        sent: new Date(tx.timestamp * 1000),
        content: tx // just to follow xmtp message.content format
      },
      isSender: tx.senderAddress == address
    }))

    return [...textMessages, ...txMessages].sort((a, b) => a.message.sent - b.message.sent);
  }, [messages])

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
