import { Conversation } from '@xmtp/xmtp-js';
import { Client } from '@xmtp/xmtp-js';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useSigner } from 'wagmi';

import { XmtpContext } from '../../contexts/xmtp';
import useMessageStore from '../../hooks/useMessageStore';

export type XmtpProviderProps = {
  children: React.ReactNode;
};

export const XmtpProvider: React.FC<XmtpProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client>();
  const { data: signer } = useSigner();

  const { getMessages, dispatchMessages } = useMessageStore();
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false);

  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return [];
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress;
          }) < 0 && convo.peerAddress != client?.address
      );
      return newConvos === undefined ? [] : state.concat(newConvos);
    },
    []
  );

  const connect = useCallback(async () => {
    if (signer !== undefined && signer !== null) {
      const client = await Client.create(signer);

      setClient(client);
    }
  }, [signer]);

  const disconnect = useCallback(async () => {
    if (client) {
      setClient(undefined);
      dispatchConversations(undefined);
    }
  }, [setClient, dispatchConversations, client]);

  useEffect(() => {
    const listConversations = async () => {
      if (!client) return;
      setLoadingConversations(true);
      const convos = await client.conversations.list();
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo]);
      });
      setLoadingConversations(false);
    };
    listConversations();
  }, [client]);

  useEffect(() => {
    const streamConversations = async () => {
      if (!client) return;
      const stream = await client.conversations.stream();
      for await (const convo of stream) {
        dispatchConversations([convo]);
      }
    };
    streamConversations();
  }, [client]);

  return (
    <XmtpContext.Provider
      value={{
        client,
        conversations,
        loadingConversations,
        getMessages,
        dispatchMessages,
        connect,
        disconnect,
      }}
    >
      {children}
    </XmtpContext.Provider>
  );
};

export default XmtpProvider;
