import { Client, Message } from '@xmtp/xmtp-js';
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations';
import { Signer } from 'ethers';
import { createContext, Dispatch } from 'react';

export type MessageStoreEvent = {
  peerAddress: string;
  messages: Message[];
};

export type XmtpContextType = {
  client: Client | undefined;
  conversations: Conversation[];
  loadingConversations: boolean;
  getMessages: (peerAddress: string) => Message[];
  dispatchMessages?: Dispatch<MessageStoreEvent>;
  connect: () => void;
  disconnect: () => void;
};

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: [],
  loadingConversations: false,
  getMessages: () => [],
  connect: () => undefined,
  disconnect: () => undefined,
});

export default XmtpContext;
