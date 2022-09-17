import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ThemeToggler from 'src/pages/ThemeToggler'
import Card from './Card'

const Login = () => {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <ConnectButton />
        <ThemeToggler />
        <Card rounded={'lg'} boxShadow={'lg'} p={8}>
          <Stack spacing={8}>
            <Button>Connect your wallet</Button>

            <Heading fontSize={'3xl'}>
              It doesn't seem that you have a name?
            </Heading>
            <FormControl id="name">
              <Input placeholder="ENS / Unstoppable Domains" type="name" />
            </FormControl>

            <Button>Start! 🚀</Button>
          </Stack>
        </Card>
      </Stack>
    </Flex>
  )
}

export default Login
