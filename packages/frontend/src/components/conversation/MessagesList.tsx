import { Flex } from '@chakra-ui/react';
import AddressPill from '@components/commons/AddressPill';
import { Message } from '@xmtp/xmtp-js';
import React, { MutableRefObject } from 'react';
import { useAccount } from 'wagmi';

import { formatTime } from '../../helpers';
import Avatar from '../commons/Avatar';
import MessageRenderer, { Transaction } from './MessageRenderer';

export type MessageListProps = {
  messages: MessageTileProps[];
  messagesEndRef: MutableRefObject<null>;
};

export type MessageTileProps = {
  type: string;
  message: Message | Transaction;
  isSender: boolean;
};

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString();
};

const formatDate = (d?: Date) =>
  d?.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const MessageTile: React.FC<{ messageTileData: MessageTileProps }> = ({
  messageTileData,
}) => {
  const { message, isSender } = messageTileData;
  return (
    <Flex mx="auto" mb={4} alignItems="start">
      <Avatar addressOrName={message.senderAddress as string} />
      <div className="ml-2">
        <div>
          <AddressPill
            address={message.senderAddress as string}
            userIsSender={isSender}
          />
          <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase">
            {formatTime(message.sent)}
          </span>
        </div>
        <span className="block text-md px-2 mt-2 font-normal">
          <MessageRenderer messageTileData={messageTileData} />
        </span>
      </div>
    </Flex>
  );
};

const DateDividerBorder: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <div className="grow h-0.5 bg-gray-300/25" />
    {children}
    <div className="grow h-0.5 bg-gray-300/25" />
  </>
);

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className="flex align-items-center items-center pb-8 pt-4">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-gray-300 text-sm font-bold">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
);

const ConversationBeginningNotice = (): JSX.Element => (
  <div className="flex align-items-center justify-center pb-4">
    <span className="text-gray-300 text-sm font-semibold">
      This is the beginning of the conversation
    </span>
  </div>
);

const MessagesList = ({
  messages,
  messagesEndRef,
}: MessageListProps): JSX.Element => {
  const { address } = useAccount();
  let lastMessageDate: Date | undefined;
  return (
    <Flex grow={1}>
      <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
        <div className="relative w-full px-4 pt-6 overflow-y-auto flex">
          <div className="w-full">
            {messages && messages.length ? (
              <ConversationBeginningNotice />
            ) : null}
            {messages?.map((msg: MessageTileProps, idx: number) => {
              msg.isSender = msg.message.senderAddress === address;
              const dateHasChanged = !isOnSameDay(
                lastMessageDate,
                msg.message.sent
              );
              lastMessageDate = msg.message.sent;
              return dateHasChanged ? (
                <div key={idx}>
                  <DateDivider date={msg.message.sent} />
                  <MessageTile key={idx} messageTileData={msg} />
                </div>
              ) : (
                <MessageTile key={idx} messageTileData={msg} />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </Flex>
  );
};
export default React.memo(MessagesList);
