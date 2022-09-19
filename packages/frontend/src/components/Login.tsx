import {
  Flex,
  FormControl,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Spinner,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { BsAward } from 'react-icons/bs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SyntheticEvent, useCallback, useState } from 'react';
import ThemeToggler from 'src/pages/ThemeToggler';
import { useAccount } from 'wagmi';
import Card from './Card';

const RegisterNickName = () => {
  const [nickname, setNickname] = useState<string>('')
  const onInputChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setNickname(e.currentTarget.value),
    [setNickname]
  );

  const submitNickname = (e: SyntheticEvent) => {
    e.preventDefault()
    console.log(nickname)
  }
  return (
    <>
      <Heading fontSize={'3xl'}>
        It doesn't seem that you have a name?
      </Heading>
      <form onSubmit={submitNickname}>
        <FormControl id="name">
          <InputGroup>
            <Input placeholder="ENS / Unstoppable Domains" onChange={onInputChange} />
            <InputRightElement children={<IconButton disabled={!nickname} size='xs' aria-label='Register nickname' variant='ghost' as={BsAward} onClick={submitNickname} />} />
          </InputGroup>
        </FormControl>
      </form>
    </>
  )
}

const Login = () => {
  let { address } = useAccount()

  const resolvedName = '123'
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <ThemeToggler />
        <Card rounded={'lg'} boxShadow={'lg'} p={8}>
          <Stack spacing={3} align='center'>

            {!address ?
            <>
              <ConnectButton.Custom>
                {({ openConnectModal }) =>
                  <Button onClick={openConnectModal}>
                    Connect your wallet
                  </Button>
                }
              </ConnectButton.Custom>
              </>
              : <></>
            }

            {address ?
              (resolvedName ?
                <>
                  <Heading fontSize={'3xl'}>
                    <Flex>
                      Welcome,
                      <Text bgGradient='linear(to-l, #7928CA, #FF0080)' bgClip='text' fontSize='3xl' fontWeight='extrabold'>
                        {resolvedName}
                      </Text>
                      &nbsp;!
                    </Flex>
                  </Heading>
                  <Text fontSize={'2xl'}>
                    Waiting for signature&nbsp;<Spinner />
                  </Text>
                  <ConnectButton.Custom>
                    {({ openAccountModal }) =>
                      <Text onClick={openAccountModal} fontSize={'md'} color={'blue.400'}>
                        Disconnect
                      </Text>
                    }
                  </ConnectButton.Custom>
                </>
                :
                <>
                <RegisterNickName />
                </>)
              : <></>

            }

          </Stack>
        </Card>
      </Stack>
    </Flex>
  );
};

export default Login;
