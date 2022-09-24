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

export type LoginCardProps = {
  isConnected?: boolean;
  address?: string;
  avatarImage?: string;
};

const LoginCard: React.FC<LoginCardProps> = ({
  isConnected,
  address,
  avatarImage,
}: LoginCardProps) => {
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
  } else if (address !== undefined && isConnected) {
    CardContent = function CardContent() {
      return (
        <>
          <Heading fontSize={'3xl'}>
            <Flex>
              Welcome,
              <Text
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="extrabold"
              >
                {/* {resolvedName} */}
              </Text>
              &nbsp;!
            </Flex>
          </Heading>
          <Text fontSize={'2xl'}>
            Waiting for signature&nbsp;
            <Spinner />
          </Text>
          <ConnectButton.Custom>
            {({ openAccountModal }) => (
              <Text
                onClick={openAccountModal}
                fontSize={'md'}
                color={'blue.400'}
              >
                Disconnect
              </Text>
            )}
          </ConnectButton.Custom>
        </>
      );
    };
  }

  return (
    <Stack spacing={8} mx="auto" width="500px" p={6}>
      {/* <ThemeToggler /> */}
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

export const Login = () => {
  const { address, isConnected } = useAccount();

  return (
    <Flex width="full" minH={'100vh'} justify="start" direction="column">
      <Flex width="full" padding="4">
        <TitleText>DeChat</TitleText>
      </Flex>
      <Flex width="full" grow={1}>
        <LoginCard isConnected={isConnected} address={address} />
      </Flex>
    </Flex>
  );
};
