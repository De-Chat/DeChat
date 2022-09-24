import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import Card from '@components/commons/Card';
import ThemeToggler from '@components/commons/ThemeToggler';
import useUnsAvatar from '@hooks/useUnsAvatar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { BaseButton } from './commons/BaseButton';
import { TitleText } from './commons/TitleText';

export type LoginProps = {
  isConnected: boolean;
  isReady: boolean;
  address?: string;
};

const LoginCard: React.FC<LoginProps & { avatarImage?: string }> = ({
  isConnected,
  isReady,
  address,
  avatarImage,
}) => {
  let CardContent = () => <></>;
  if (address === undefined) {
    CardContent = function CardContent() {
      return (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <BaseButton onClick={openConnectModal}>
              Connect your wallet
            </BaseButton>
          )}
        </ConnectButton.Custom>
      );
    };
  } else if (isConnected && !isReady) {
    CardContent = function CardContent() {
      return (
        <Flex direction="column">
          <Heading fontSize={'3xl'}>
            <Flex justifyContent={'center'} textAlign="center">
              Welcome !
              {/* <Text
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="extrabold"
              > {resolvedName}
              </Text> */}
            </Flex>
          </Heading>
          <Flex justifyContent="center" alignItems="center"  mt="3">
            <Text fontSize={'2xl'} mr='5'>
              Waiting for signature&nbsp;
            </Text>
            <Spinner />
          </Flex>
          <ConnectButton.Custom>
            {({ openAccountModal }) => (
              <Text
                onClick={openAccountModal}
                fontSize={'md'}
                color={'blue.400'}
                mt="2"
              >
                Disconnect
              </Text>
            )}
          </ConnectButton.Custom>
        </Flex>
      );
    };
  }

  return (
    <Stack spacing={8} mx="auto" width="500px" p={6}>
      <Card
        rounded={'lg'}
        boxShadow={'lg'}
        p={8}
        background="secondaryDark"
        backgroundColor="secondaryDark"
      >
        <Flex direction="column" height="full">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            pb={8}
            direction="column"
          >
            <Heading fontSize={'4xl'}>Sign in</Heading>
            <Avatar src={avatarImage} size="lg" mt={5} />
          </Flex>
          <Box textAlign="center" mt={1}>
            <CardContent />
          </Box>
        </Flex>
      </Card>
    </Stack>
  );
};

export const Login: React.FC<LoginProps> = ({
  address,
  isConnected,
  isReady,
}) => {
  return (
    <Flex width="full" minH={'100vh'} justify="start" direction="column">
      <Flex width="full" padding="4">
        <TitleText>DeChat</TitleText>
      </Flex>
      <Flex width="full" grow={1}>
        <LoginCard
          isConnected={isConnected}
          isReady={isReady}
          address={address}
        />
      </Flex>
    </Flex>
  );
};
