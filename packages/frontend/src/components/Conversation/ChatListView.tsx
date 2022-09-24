import { Flex, Show } from '@chakra-ui/react';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, PropsWithChildren } from 'react';

const ChatListView: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Show below="md">
        <Transition.Root show={router.pathname === '/'} as={Fragment}>
          <Flex position="fixed" inset="0">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Flex position="relative" direction="column" width="full">
                {children}
              </Flex>
            </Transition.Child>
          </Flex>
        </Transition.Root>
      </Show>
      {/* Always show in desktop layout */}
      <Show above="md">{children}</Show>
    </>
  );
};

export default ChatListView;
