import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import Card from '@components/commons/Card';
import ThemeToggler from '@components/commons/ThemeToggler';
import useUnsAvatar from '@hooks/useUnsAvatar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const LoginPage = () => {
  const { address, isConnected } = useAccount();
  const avatarImage = useUnsAvatar('weihan37.wallet');

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        {/* <ThemeToggler /> */}
        <Card rounded={'lg'} boxShadow={'lg'} p={8}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            <Avatar src={avatarImage} size="lg" />
          </Text>
          <Stack spacing={3} align="center">
            {!address ? (
              <>
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button onClick={openConnectModal}>
                      Connect your wallet
                    </Button>
                  )}
                </ConnectButton.Custom>
              </>
            ) : (
              <></>
            )}

            {address ? (
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
            ) : (
              <></>
            )}
          </Stack>
        </Card>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
