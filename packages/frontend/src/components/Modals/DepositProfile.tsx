import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsSafe } from 'react-icons/bs';
import { HiOutlineX } from 'react-icons/hi';
import { RiUserSharedLine } from 'react-icons/ri';
import {
  getTokenBalancesForAddress,
  IBalances,
  ITokenBalance,
} from 'src/services/covalentService';
import truncateEthAddress from 'truncate-eth-address';
import useAsyncEffect from 'use-async-effect';
import { useAccount, useEnsAvatar } from 'wagmi';

type Lends = {
  addressTo: string;
  chainId: number;
  symbol: string;
  amount: number;
  txLink: string;
};

const BalanceListItem = ({ token }: ITokenBalance) => {
  return (
    <Button variant={'ghost'} width="full" justifyContent={'start'}>
      <HStack gap={2}>
        <Avatar src={token.logo} />
        <Text>
          {token.amount} {token.symbol}
        </Text>
      </HStack>
    </Button>
  );
};

const BorrowerListItem = ({ lend }: Lends) => {
  const [busy, setBusy] = useState(false);

  const {
    data: borrowerAvatar,
    isError,
    isLoading,
  } = useEnsAvatar({
    addressOrName: lend.addressTo,
  });

  const onDelete = useCallback(() => {
    setBusy(true);
    // TODO: remove records from tableland

    // setBusy(false)
  }, [lend.addressTo]);

  return (
    <Link href={lend.txLink} isExternal>
      <HStack flex={1}>
        <Button variant={'ghost'} width="full" justifyContent={'start'}>
          <HStack gap={2}>
            <Avatar src={borrowerAvatar} />
            <Text>{truncateEthAddress(lend.addressTo)}</Text>
            <Text>
              {lend.amount} {lend.symbol}
            </Text>
          </HStack>
        </Button>
        {busy ? (
          <Spinner />
        ) : (
          <IconButton
            onClick={onDelete}
            as={HiOutlineX}
            size="sm"
            color={'red.400'}
            variant="ghost"
            aria-label="Remove borrower"
          />
        )}
      </HStack>
    </Link>
  );
};

const DepositProfile = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const { address } = useAccount();
  const [balances, setBalances] = useState<IBalances | null>(null);
  // Covalent API
  // TODO: fetch from correct chainIDs
  useAsyncEffect(async () => {
    const balancesForUser = await getTokenBalancesForAddress(
      1,
      address as string
    );
    setBalances(balancesForUser as IBalances);
  }, [address]);

  // borrowers
  // TODO: fetch borrows from tableland
  const borrowers = useMemo(() => {
    return [
      {
        addressTo: '0x29d7d1dd5b6f9c864d9db560d72a247c178ae86b',
        chainId: 1,
        symbol: 'USDC',
        amount: 123,
        txLink:
          'https://etherscan.io/tx/0x39eef0326cb3c86c17f3b537514fa557ce183486ad2d9d6c4b40c8a4c0c6798f',
      },
    ];
  }, [address]);

  return (
    <>
      <Box ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        Some other content that'll receive focus on close.
      </Box>

      <Button mt={4} onClick={onOpen}>
        Deposit
      </Button>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingTop={5} paddingBottom={5}>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDir={'column'} w="full" gap={5}>
              <VStack>
                <Text fontSize={'lg'}>Deposited</Text>
                <Heading fontSize={'4xl'}>$ {balances?.totalUSD || 0}</Heading>
              </VStack>
              <Divider />

              {/* Balance section */}
              <Container>
                <List spacing={3}>
                  <ListItem>
                    <Text fontSize={'lg'}>
                      <Icon as={BsSafe} />
                      &nbsp;Balance
                    </Text>
                  </ListItem>

                  {balances?.tokens?.map((token, idx) => (
                    <ListItem key={idx}>
                      <BalanceListItem token={token} />
                    </ListItem>
                  ))}
                </List>
              </Container>
              <Box>
                <Flex justify="center">See more...</Flex>
              </Box>

              <Divider />

              {/* Borrowers section */}
              <Container>
                <List spacing={3} flex="1">
                  <ListItem>
                    <Text fontSize={'lg'}>
                      <Icon as={RiUserSharedLine} />
                      &nbsp;Borrowers
                    </Text>
                  </ListItem>

                  {borrowers?.map((lend, idx) => (
                    <ListItem key={idx}>
                      <BorrowerListItem lend={lend} />
                    </ListItem>
                  ))}
                </List>
              </Container>
              <Box>
                <Flex justify="center">See more...</Flex>
              </Box>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DepositProfile;
