import React, { useCallback, useEffect, useRef } from 'react';
import useXmtp from '../../hooks/useXmtp';
import useConversation from '../../hooks/useConversation';
import { MessagesList, MessageComposer } from '.';
import Loader from '../Loader';
import useEns from '../../hooks/useEns';

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
      <MessagesList messagesEndRef={messagesEndRef} messages={messages} />
      {walletAddress && <MessageComposer onSend={sendMessage} />}
    </main>
  );
};

export default Conversation;
