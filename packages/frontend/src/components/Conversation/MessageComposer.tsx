import { Flex, FormControl, Icon, IconButton, Input } from '@chakra-ui/react';
import ImageUploader from '@components/Modals/ImageUploader';
import { useRouter } from 'next/router';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';

import { classNames } from '../../helpers';
import messageComposerStyles from '../../styles/MessageComposer.module.scss';

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>;
};

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr]);

  const onMessageChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setMessage(e.currentTarget.value),
    []
  );

  const onSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      if (!message) {
        return;
      }
      setMessage('');
      await onSend(message);
    },
    [onSend, message]
  );

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <FormControl>
        <Flex gap={2} align="center">
          <ImageUploader onSend={onSend} />
          <Input
            flex={1}
            type="text"
            placeholder="Type something..."
            className={classNames(
              'block',
              'w-full',
              'text-md',
              'md:text-sm',
              messageComposerStyles.input
            )}
            name="message"
            value={message}
            onChange={onMessageChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSubmit(e);
              }
            }}
            required
          />
          <IconButton
            type="submit"
            disabled={!message ? true : false}
            variant="outline"
            border="none"
            aria-label="Send message"
            icon={<Icon as={FiSend} />}
          />
        </Flex>
      </FormControl>
    </form>
  );
};

export default MessageComposer;
