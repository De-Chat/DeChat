import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Link,
  ModalHeader,
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Send__factory } from '@dechat/contracts/typechain-types';
import { ethers } from 'ethers';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoRocketOutline } from 'react-icons/io5';
import { urlPrefix } from 'src/helpers/environment';
import { createFramework } from 'src/hooks/superFluid/useCreateFramework';
import { createWrappedSuperToken } from 'src/hooks/superFluid/useCreateWrappedSuperToken';
import { upgradeCreateFlow } from 'src/hooks/superFluid/useUpgradeCreateFlow';
import {
  getSuperfluidBaseTokens,
  getSuperfluidSupertoken,
} from 'src/hooks/superFluid/wrappingMap';
import { useDeployments } from 'src/hooks/useDeployments';
import {
  getNFTForAddress,
  getTokenBalancesForAddress,
  ITokenBalance,
} from 'src/services/covalentService';
import { SuperfluidToken } from 'src/services/superFluidService';
import useAsyncEffect from 'use-async-effect';
import {
  erc20ABI,
  erc721ABI,
  useBlockNumber,
  useContract,
  useContractRead,
  useNetwork,
  useProvider,
} from 'wagmi';

import { encodeMessage } from '../../helpers/message-parser';
import useXmtp from '../../hooks/useXmtp';
import BaseModal from './BaseModal';

///// helpers
const approveErc20 = async (
  contract: ethers.Contract,
  address: string,
  amount: string,
  decimals: number
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx;
    tsx = await contract.approve(
      address,
      ethers.utils.parseUnits(amount, decimals)
    );
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

const approveErc721 = async (
  contract: ethers.Contract,
  address: string,
  tokenId: number
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx;
    tsx = await contract.approve(address, tokenId);
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

const sendEth = async (
  contract: ethers.Contract,
  address: string,
  amount: string
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx;
    tsx = await contract.sendEth(address, {
      value: ethers.utils.parseEther(amount),
    });
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

const sendERC20 = async (
  contract: ethers.Contract,
  tokenAddr: string,
  recipient: string,
  amount: string,
  decimals: number
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    const formattedAmount = ethers.utils.parseUnits(amount, decimals);
    let tsx = await contract.sendErc20(tokenAddr, recipient, formattedAmount);
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

const sendERC721 = async (
  contract: ethers.Contract,
  tokenAddr: string,
  recipient: string,
  id: number
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx = await contract.sendErc721(tokenAddr, recipient, id);
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

const sendERC1155 = async (
  contract: ethers.Contract,
  tokenAddr: string,
  recipient: string,
  tokenId: number,
  amount: number
) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx = await contract.sendErc1155(
      tokenAddr,
      recipient,
      tokenId,
      amount,
      []
    );
    const receipt = await tsx.wait();
    console.log({ receipt });
    return receipt;
  } catch (e: any) {
    console.error(e);
  }
};

///// components
// helpers
const InputWithPeerAddress = ({
  peerAddress,
  form,
  setForm,
  handleFormChange,
}: {
  peerAddress: string;
  form: any;
  setForm: Function;
  handleFormChange: any;
}) => {
  // TODO: peerAddress actually can be fetch from URL..
  // UI helpers
  const inputTo = useRef<any>(undefined);
  const onSetPeerAddress = useCallback(() => {
    if (inputTo.current) {
      console.log('test peerAddress: ', peerAddress);
      inputTo.current.value = peerAddress;
      setForm({ ...form, to: peerAddress });
    }
  }, [inputTo, peerAddress, setForm, form]);
  return (
    <InputGroup>
      <Input
        ref={inputTo}
        placeholder="Receiver"
        name="to"
        onChange={handleFormChange}
      />
      {!form.to ? (
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={onSetPeerAddress}>
            Peer
          </Button>
        </InputRightElement>
      ) : null}
    </InputGroup>
  );
};
// send token
const SendToken = ({
  disclosure,
  showTxToast,
  peerAddress,
}: {
  disclosure: any;
  showTxToast: Function;
  peerAddress: string;
}) => {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!disclosure.isOpen) {
      setBusy(false);
      setForm({});
    }
  }, [disclosure.isOpen]);

  // form update
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string>();
  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tokenAddr = e.target.value;
    const chainId = chain?.id;
    console.log(
      'test select: ',
      chainId,
      tokenAddr,
      getTokenByAddress(tokenAddr)
    );
    setForm({ ...form, token: getTokenByAddress(tokenAddr) });
    console.log('test select token: ', e.target.value);
  };
  const handleCheckboxChange = (e: React.FormEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.checked });
  // TODO: validation
  const validateForm = () => {
    if (!form['to'] || !form['token'] || !form['amount']) {
      setError('Transaction info is incomplete');
      return false;
    }
    setError(undefined);
    return true;
  };
  console.log('test form: ', form);

  // contract and stuff
  const { wallet: signer, walletAddress: address } = useXmtp();
  const { contracts } = useDeployments();
  // Approve contract and read / write function
  const {
    data: allowance,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: form.token?.address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, contracts?.Send.address],
    watch: true,
  });
  const approved = useMemo(() => {
    try {
      const amount = form.amount;
      const decimals = form.token.decimals;
      const parsedAmount = ethers.utils.parseUnits(amount, decimals);
      if (allowance !== undefined) {
        return allowance.gte(parsedAmount);
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [form, allowance]);
  // const tokenContract = useContract({
  //   addressOrName: form.token?.address,
  //   contractInterface: erc20ABI,
  //   signerOrProvider: signer
  // })
  const onApprove = async () => {
    if (!validateForm() || !contracts) return;

    setBusy(true);
    let { to, token, amount } = form;
    const tokenContract = new ethers.Contract(
      form.token?.address,
      erc20ABI,
      signer
    );
    console.log('test erc20: ', token.address, to, amount);
    const receipt = await approveErc20(
      tokenContract,
      contracts.Send.address,
      amount,
      token.decimals
    );
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  // ERC20 contract and write function
  const sendContract = useMemo(() => {
    if (!signer || !contracts) return undefined;
    return Send__factory.connect(contracts.Send.address, signer);
  }, [signer, contracts]);

  const onSend = async () => {
    if (!validateForm() || !sendContract) return;

    setBusy(true);
    let { to, token, amount } = form;
    const receipt = await sendERC20(
      sendContract,
      token.address,
      to,
      amount,
      token.decimals
    );

    // TODO: write to tableland if this is a lend
    disclosure.onClose();
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  // tokenlist
  const { chain } = useNetwork();
  // const tokenlist = useMemo(() => getERC20s(chain?.id) || [], [chain?.id])
  const [tokenlist, setTokenlist] = useState<ITokenBalance[]>([]);
  useAsyncEffect(async () => {
    if (chain?.id && address) {
      const tokenlistForChain = await getTokenBalancesForAddress(
        chain?.id,
        address
      );
      setTokenlist(tokenlistForChain?.tokens || []);
    }
  }, [chain?.id, address]);
  const getTokenByAddress = useCallback(
    (tokenAddr: string) => tokenlist.find((t) => t.address == tokenAddr),
    [tokenlist]
  );

  const amountPlaceholder = useMemo(
    () =>
      form.token?.amount
        ? `Bal: ${parseFloat(form.token?.amount).toFixed(4)}`
        : 'Amount',
    [form.token]
  );

  console.log('test tokenlist: ', tokenlist);

  return (
    <Container centerContent>
      <FormControl mt={3} mb={3} isInvalid={!!error} onSubmit={onSend}>
        <VStack spacing={4}>
          <InputWithPeerAddress
            {...{ peerAddress, form, setForm, handleFormChange }}
          />
          <Select
            placeholder="Token"
            name="token"
            onChange={handleSelectChange}
          >
            {tokenlist?.map((token: any) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </Select>
          <Input
            placeholder={amountPlaceholder}
            name="amount"
            type="number"
            onChange={handleFormChange}
          />
          {/* <Checkbox name='lend' onChange={handleCheckboxChange}>Lend to receiver</Checkbox> */}
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </VStack>
      </FormControl>

      <Center mt={5}>
        {busy ? (
          <Spinner />
        ) : approved ? (
          <Button onClick={onSend}>Send</Button>
        ) : (
          <Button onClick={onApprove}>Approve</Button>
        )}
      </Center>
    </Container>
  );
};

// send NFT
const SendNFT = ({
  disclosure,
  showTxToast,
  peerAddress,
}: {
  disclosure: any;
  showTxToast: Function;
  peerAddress: string;
}) => {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!disclosure.isOpen) {
      setBusy(false);
      setForm({});
    }
  }, [disclosure.isOpen]);

  // form update
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string>();
  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('test select: ', chain?.id, e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // TODO: validation
  const validateForm = () => {
    if (!form['to'] || !form['contract'] || !form['tokenId']) {
      setError('Transaction info is incomplete');
      return false;
    }
    setError(undefined);
    return true;
  };
  console.log('test form: ', form);

  // contract and stuff
  const { wallet: signer, walletAddress: address } = useXmtp();
  const { contracts } = useDeployments();
  // Approve contract and read / write function
  const {
    data: getApproved,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: form.contract,
    contractInterface: erc721ABI,
    functionName: 'getApproved',
    args: [form.tokenId],
    watch: true,
  });
  const approved = useMemo(() => {
    try {
      return getApproved == contracts?.Send.address;
    } catch (e) {
      return false;
    }
  }, [getApproved, contracts]);
  // const tokenContract = useContract({
  //   addressOrName: form.token?.address,
  //   contractInterface: erc20ABI,
  //   signerOrProvider: signer
  // })
  const onApprove = async () => {
    if (!validateForm() || !contracts) return;

    setBusy(true);
    const nftContract = new ethers.Contract(form.contract, erc721ABI, signer);
    const receipt = await approveErc721(
      nftContract,
      contracts.Send.address,
      form?.tokenId
    );
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  // ERC721 contract and write function
  const sendContract = useMemo(() => {
    if (!signer || !contracts) return undefined;
    return Send__factory.connect(contracts.Send.address, signer);
  }, [signer, contracts]);

  const onSend = async () => {
    if (!validateForm() || !sendContract) return;

    setBusy(true);
    let { to, contract, tokenId } = form;
    const receipt = await sendERC721(sendContract, contract, to, tokenId);

    // TODO: write to tableland if this is a lend

    disclosure.onClose();
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  // tokenlist
  const { chain } = useNetwork();
  const [nfts, setNfts] = useState<any[]>([]);
  useAsyncEffect(async () => {
    if (chain?.id && address) {
      const nftsForChain = await getNFTForAddress(chain?.id, address);
      setNfts(nftsForChain);
    }
  }, [chain?.id, address]);
  const tokenIds = useMemo(() => {
    if (form.contract && nfts.length)
      return nfts.find((n) => n.address == form.contract).data;
    return [];
  }, [nfts, form.contract]);

  console.log('test nfts and tokenid: ', nfts, tokenIds);

  return (
    <Container centerContent>
      <FormControl mt={3} mb={3} isInvalid={!!error} onSubmit={onSend}>
        <VStack spacing={4}>
          <InputWithPeerAddress
            {...{ peerAddress, form, setForm, handleFormChange }}
          />
          <Select
            placeholder="Contract"
            name="contract"
            onChange={handleSelectChange}
          >
            {nfts.map((nft: any) => (
              <option key={nft.name} value={nft.address}>
                {nft.name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Token ID"
            name="tokenId"
            onChange={handleSelectChange}
          >
            {tokenIds.map((tokenId: any) => (
              <option key={tokenId.name} value={tokenId.id}>
                {tokenId.name}
              </option>
            ))}
          </Select>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </VStack>
      </FormControl>

      <Center mt={5}>
        {busy ? (
          <Spinner />
        ) : approved ? (
          <Button onClick={onSend}>Send</Button>
        ) : (
          <Button onClick={onApprove}>Approve</Button>
        )}
      </Center>
    </Container>
  );
};

// send Stream
const SendStream = ({
  disclosure,
  showTxToast,
  peerAddress,
  sendPeer,
}: {
  disclosure: any;
  showTxToast: Function;
  peerAddress: string;
  sendPeer: Function;
}) => {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!disclosure.isOpen) {
      setBusy(false);
      setForm({});
    }
  }, [disclosure.isOpen]);

  // form update
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string>();
  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tokenAddr = e.target.value;
    const chainId = chain?.id;
    console.log(
      'test select: ',
      chainId,
      tokenAddr,
      getTokenByAddress(tokenAddr)
    );
    setForm({ ...form, token: getTokenByAddress(tokenAddr) });
    console.log('test select token: ', e.target.value);
  };
  // TODO: validation
  const validateForm = () => {
    if (
      !form['to'] ||
      !form['token'] ||
      !form['flowrate'] ||
      !form['upgradeAmount']
    ) {
      setError('Transaction info is incomplete');
      return false;
    } else if (form['to'] == address) {
      setError("You can't stream to yourself");
      return false;
    }
    setError(undefined);
    return true;
  };
  console.log('test form: ', form);

  // contract and stuff
  const { wallet: signer, walletAddress: address } = useXmtp();
  const { contracts } = useDeployments();
  // Approve contract and read / write function
  const {
    data: allowance,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: form.token?.address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, form.token?.supertokenAddress],
    watch: true,
  });
  const approved = useMemo(() => {
    try {
      const upgradeAmount = form.upgradeAmount;
      const decimals = form.token.decimals;
      const parsedAmount = ethers.utils.parseUnits(upgradeAmount, decimals);
      if (allowance !== undefined) {
        return allowance.gte(parsedAmount);
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [form, allowance]);
  const onApprove = async () => {
    if (!validateForm()) return;

    setBusy(true);
    let { to, token, upgradeAmount } = form;
    const tokenContract = new ethers.Contract(
      form.token?.address,
      erc20ABI,
      signer
    );
    const receipt = await approveErc20(
      tokenContract,
      form.token?.supertokenAddress,
      upgradeAmount,
      token.decimals
    );
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  const provider = useProvider();
  const onUpgradeAndStream = async () => {
    if (!validateForm() || !signer || !address) return;

    setBusy(true);

    const framework = await createFramework(provider);
    const wrappedSuperToken = await createWrappedSuperToken(
      framework,
      form.token?.supertokenAddress
    );
    const supertoken = new SuperfluidToken(
      framework,
      signer,
      wrappedSuperToken
    );
    const parsedUpgradeAmount = ethers.utils.parseUnits(
      form.upgradeAmount,
      form.token?.decimals
    );
    const parsedFlowrate = ethers.utils.parseEther(form.flowrate);
    const receipt = await upgradeCreateFlow(
      supertoken,
      parsedUpgradeAmount,
      address,
      form.to,
      parsedFlowrate.toString(),
      undefined
    );
    console.log({ receipt });

    // send the link to streaming via Xmtp conversation API
    const payload = {
      txHash: receipt.transactionHash,
      token: form.token?.symbol,
      amount: form.upgradeAmount,
      flowrate: form.flowrate,
    };
    const encodedMsg = encodeMessage('streamFund', payload);
    await sendPeer(encodedMsg);

    // TODO: write to tableland if this is a lend
    disclosure.onClose();
    setBusy(false);
    showTxToast(receipt.transactionHash);
  };

  // tokenlist
  const { chain } = useNetwork();
  // const tokenlist = useMemo(() => getERC20s(chain?.id) || [], [chain?.id])
  const [tokenlist, setTokenlist] = useState<ITokenBalance[]>([]);
  useAsyncEffect(async () => {
    if (chain?.id && address) {
      let userTokenlist = await getTokenBalancesForAddress(chain?.id, address);
      // filter only Superfluid base token listed in src/hooks/superfluid/wrappingMap
      const superfluidBasetokens = getSuperfluidBaseTokens();
      console.log('test superfluid: ', userTokenlist, superfluidBasetokens);
      let userSuperfluidBaseTokens = userTokenlist?.tokens.filter((t) =>
        superfluidBasetokens.includes(t.address)
      );
      userSuperfluidBaseTokens = userSuperfluidBaseTokens?.map((t) => ({
        ...t,
        supertokenAddress: getSuperfluidSupertoken(t.address),
      }));
      setTokenlist(userSuperfluidBaseTokens || []);
    }
  }, [chain?.id, address]);
  const getTokenByAddress = useCallback(
    (tokenAddr: string) => tokenlist.find((t) => t.address == tokenAddr),
    [tokenlist]
  );

  const upgradeAmountPlaceholder = useMemo(
    () =>
      form.token?.amount
        ? `Bal: ${parseFloat(form.token?.amount).toFixed(4)}`
        : 'Upgrade Amount',
    [form.token]
  );

  console.log('test superfluid tokenlist: ', tokenlist);

  return (
    <Container centerContent>
      <Link
        target="_blank"
        href={`${urlPrefix.superfluidConsole}/accounts/${address}?tab=streams`}
      >
        Check your streamings
      </Link>
      <FormControl
        mt={3}
        mb={3}
        isInvalid={!!error}
        onSubmit={onUpgradeAndStream}
      >
        <VStack spacing={4}>
          <InputWithPeerAddress
            {...{ peerAddress, form, setForm, handleFormChange }}
          />
          <Select
            placeholder="Token"
            name="token"
            onChange={handleSelectChange}
          >
            {tokenlist?.map((token: any) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </Select>
          <Input
            placeholder={upgradeAmountPlaceholder}
            name="upgradeAmount"
            onChange={handleFormChange}
          />
          <InputGroup>
            <Input
              placeholder="Flowrate"
              name="flowrate"
              type="number"
              onChange={handleFormChange}
            />
            <InputRightAddon>/ second</InputRightAddon>
          </InputGroup>
          {error ? (
            <>
              <FormErrorMessage>{error}</FormErrorMessage>
            </>
          ) : null}
        </VStack>
      </FormControl>

      <Center mt={5}>
        {busy ? (
          <Spinner />
        ) : approved ? (
          <Button onClick={onUpgradeAndStream}>Stream</Button>
        ) : (
          <Button onClick={onApprove}>Approve</Button>
        )}
      </Center>
    </Container>
  );
};

const tabs = [
  {
    name: 'TOKEN',
    component: (props: any) => <SendToken {...props} />,
  },
  {
    name: 'NFT',
    component: (props: any) => <SendNFT {...props} />,
  },
  {
    name: 'STREAM',
    component: (props: any) => <SendStream {...props} />,
  },
];

const SendModal = ({
  peerAddress,
  sendPeer,
}: {
  peerAddress: string;
  sendPeer: Function;
}) => {
  const disclosure = useDisclosure();
  const toast = useToast();
  const showTxToast = useCallback(
    (tx: string) =>
      toast({
        title: 'Transaction submitted',
        description: (
          <>
            Check your transaction{' '}
            <Link
              fontWeight={700}
              target="_blank"
              href={`${urlPrefix.blockchainExplorer}/tx/${tx}`}
            >
              HERE
            </Link>
            .
          </>
        ),
        status: 'success',
        isClosable: true,
        position: 'top-right',
      }),
    [toast]
  );

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <BaseModal disclosure={disclosure} icon={IoRocketOutline}>
      <Container centerContent>
        <ModalHeader fontSize={'3xl'}>🚛 Send</ModalHeader>

        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          onChange={(index) => setTabIndex(index)}
        >
          <TabList gap={5} justifyContent="space-evenly" width="100%">
            {tabs.map((tab) => (
              <Tab key={tab.name}>{tab.name}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {/* <BusyContext.Provider value={{ busy, setBusy }}> */}
            {tabs.map((tab) => (
              <TabPanel key={tab.name}>
                {tab.component({
                  disclosure,
                  showTxToast,
                  peerAddress,
                  sendPeer,
                })}
              </TabPanel>
            ))}
            {/* </BusyContext.Provider> */}
          </TabPanels>
        </Tabs>
      </Container>
    </BaseModal>
  );
};

export default SendModal;
