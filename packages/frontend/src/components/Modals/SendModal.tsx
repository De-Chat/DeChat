import { useDeployments } from '@shared/useDeployments';
import { useContractRead, useNetwork, erc20ABI, useProvider, useBlockNumber, useContract, erc721ABI } from 'wagmi';
import { Send__factory } from '@dechat/contracts/typechain-types';
import useXmtp from '../../hooks/useXmtp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import BaseModal from './BaseModal';
import { Button, Center, Checkbox, Container, FormControl, FormErrorMessage, HStack, Input, ModalHeader, Select, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure, VStack } from '@chakra-ui/react';
import { IoRocketOutline } from 'react-icons/io5'
import { getTokenBalancesForAddress, getNFTForAddress } from 'src/services/covalentService';
import useAsyncEffect from 'use-async-effect';

// helpers
const approveErc20 = async (contract: ethers.Contract, address: string, amount: string, decimals: number) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx;
    tsx = await contract.approve(address, ethers.utils.parseUnits(amount, decimals));
    const receipt = await tsx.wait();
    console.log({ receipt });
  } catch (e: any) {
    console.error(e);
  }
};

const approveErc721 = async (contract: ethers.Contract, address: string, tokenId: number) => {
  if (!contract) {
    console.warn('Contract not constructed!');
    return;
  }
  try {
    let tsx;
    tsx = await contract.approve(address, tokenId);
    const receipt = await tsx.wait();
    console.log({ receipt });
  } catch (e: any) {
    console.error(e);
  }
};

const sendEth = async (contract: ethers.Contract, address: string, amount: string) => {
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
  } catch (e: any) {
    console.error(e);
  }
};

// send token
const SendToken = ({ disclosure }) => {
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!disclosure.isOpen) {
      setBusy(false)
      setForm({})
    }
  }, [disclosure.isOpen])

  // form update 
  const [form, setForm] = useState<any>({})
  const [error, setError] = useState(null)
  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value })
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tokenAddr = e.target.value
    const chainId = chain?.id
    console.log('test select: ', chainId, tokenAddr, getTokenByAddress(tokenAddr))
    setForm({ ...form, token: getTokenByAddress(tokenAddr) })
    console.log('test select token: ', e.target.value)
  }
  const handleCheckboxChange = (e: React.FormEvent<HTMLInputElement>) => setForm({ ...form, [e.currentTarget.name]: e.currentTarget.checked})
  // TODO: validation
  const validateForm = () => {
    if (!form['to'] || !form['token'] || !form['amount']) {
      setError('Transaction info is incomplete')
      return false
    }
    return true
  }
  console.log('test form: ', form)

  // contract and stuff
  const { wallet: signer, walletAddress: address } = useXmtp();
  console.log('test current addr: ', address, signer);
  const { contracts } = useDeployments();
  // Approve contract and read / write function
  const { data: allowance, isError, isLoading } = useContractRead({
    addressOrName: form.token?.address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, contracts?.Send.address],
    watch: true
  })
  const approved = useMemo(() => {
    try {
      const amount = form.amount
      const decimals = form.token.decimals
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)
      return allowance.gte(parsedAmount)
    } catch (e) {
      return false
    }
  }, [form, allowance])
  // const tokenContract = useContract({
  //   addressOrName: form.token?.address, 
  //   contractInterface: erc20ABI, 
  //   signerOrProvider: signer
  // })
  const onApprove = async () => {
    if (!validateForm())
      return

    setBusy(true)
    let { to, token, amount } = form
    const tokenContract = new ethers.Contract(
      form.token?.address, 
      erc20ABI, 
      signer)
    console.log('test erc20: ', token.address, to, amount)
    await approveErc20(tokenContract, contracts?.Send.address, amount, token.decimals)
    setBusy(false)
  }

  // ERC20 contract and write function
  const sendContract = useMemo(() => {
    if (!signer || !contracts) return null;
    return Send__factory.connect(contracts.Send.address, signer);
  }, [signer, contracts]);

  const onSend = async () => {
    if (!validateForm())
      return

    setBusy(true)
    let { to, token, amount } = form
    await sendERC20(sendContract, token.address, to, amount, token.decimals)

    // TODO: write to tableland if this is a lend

    disclosure.onClose()
    setBusy(false)
  }

  // tokenlist
  const { chain } = useNetwork()
  // const tokenlist = useMemo(() => getERC20s(chain?.id) || [], [chain?.id])
  const [tokenlist, setTokenlist] = useState([])
  useAsyncEffect(async () => {
    if (chain?.id) {
      const tokenlistForChain = await getTokenBalancesForAddress(chain?.id, address)
      setTokenlist(tokenlistForChain?.tokens)
    }
  }, [chain?.id, address])
  const getTokenByAddress = useCallback((tokenAddr) => tokenlist.find(t => t.address == tokenAddr), [tokenlist])

  console.log('test tokenlist: ', tokenlist)

  return (
    <Container centerContent>
      <FormControl mt={3} mb={3} onSubmit={onSend}>
        <VStack spacing={4}>
          <Input placeholder='Receiver' name='to' onChange={handleFormChange} />
          <HStack gap={2}>
            <Select placeholder='Token' name='token' onChange={handleSelectChange}>
              {tokenlist?.map((token: any) =>
                <option key={token.address} value={token.address}>{token.symbol}</option>
              )}
            </Select>
            <Input placeholder='Amount' name='amount' type='number' onChange={handleFormChange} />
          </HStack>
          <Checkbox name='lend' onChange={handleCheckboxChange}>Lend to receiver</Checkbox>
          {error && (
            <FormErrorMessage>
              {error}
            </FormErrorMessage>
          )}
        </VStack>
      </FormControl>

      <Center mt={5} >
        {busy ? <Spinner />
          : (approved ? <Button onClick={onSend}>Send</Button>
            : <Button onClick={onApprove}>Approve</Button>)
        }
      </Center>
    </Container>
  )
}

// send NFT
const SendNFT = ({ disclosure }) => {
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!disclosure.isOpen) {
      setBusy(false)
      setForm({})
    }
  }, [disclosure.isOpen])

  // form update 
  const [form, setForm] = useState<any>({})
  const [error, setError] = useState(null)
  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value })
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('test select: ', chain?.id, e.target.name, e.target.value)
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  // TODO: validation
  const validateForm = () => {
    if (!form['to'] || !form['contract'] || !form['tokenId']) {
      setError('Transaction info is incomplete')
      return false
    }
    return true
  }
  console.log('test form: ', form)

  // contract and stuff
  const { wallet: signer, walletAddress: address } = useXmtp();
  console.log('test current addr: ', address, signer);
  const { contracts } = useDeployments();
  // Approve contract and read / write function
  const { data: getApproved, isError, isLoading } = useContractRead({
    addressOrName: form.contract,
    contractInterface: erc721ABI,
    functionName: 'getApproved',
    args: [form.tokenId],
    watch: true
  })
  const approved = useMemo(() => {
    try {
      return getApproved == contracts?.Send.address
    } catch (e) {
      return false
    }
  }, [getApproved, contracts])
  // const tokenContract = useContract({
  //   addressOrName: form.token?.address, 
  //   contractInterface: erc20ABI, 
  //   signerOrProvider: signer
  // })
  const onApprove = async () => {
    if (!validateForm())
      return

    setBusy(true)
    const nftContract = new ethers.Contract(
      form.contract, 
      erc721ABI, 
      signer)
    console.log('test erc721: ', )
    await approveErc721(nftContract, contracts?.Send.address, form?.tokenId)
    setBusy(false)
  }

  // ERC721 contract and write function
  const sendContract = useMemo(() => {
    if (!signer || !contracts) return null;
    return Send__factory.connect(contracts.Send.address, signer);
  }, [signer, contracts]);

  const onSend = async () => {
    if (!validateForm())
      return

    setBusy(true)
    let { to, contract, tokenId } = form
    await sendERC721(sendContract, contract, to, tokenId)

    // TODO: write to tableland if this is a lend

    disclosure.onClose()
    setBusy(false)
  }

  // tokenlist
  const { chain } = useNetwork()
  const [nfts, setNfts] = useState([])
  useAsyncEffect(async () => {
    if (chain?.id) {
      const nftsForChain = await getNFTForAddress(chain?.id, address)
      setNfts(nftsForChain)
    }
  }, [chain?.id, address])
  const tokenIds = useMemo(() => {
    if (form.contract && nfts.length)
      return nfts.find(n => n.address == form.contract).data
    return []
  }, [nfts, form.contract])

  console.log('test nfts and tokenid: ', nfts, tokenIds)

  return (
    <Container centerContent>
      <FormControl mt={3} mb={3} onSubmit={onSend}>
        <VStack spacing={4}>
          <Input placeholder='Receiver' name='to' onChange={handleFormChange} />
            <Select placeholder='Contract' name='contract' onChange={handleSelectChange}>
              {nfts.map((nft: any) =>
                <option key={nft.name} value={nft.address}>{nft.name}</option>
              )}
            </Select>
            <Select placeholder='Token ID' name='tokenId' onChange={handleSelectChange}>
              {tokenIds.map((tokenId: any) =>
                <option key={tokenId.name} value={tokenId.id}>{tokenId.name}</option>
              )}
            </Select>
          {error && (
            <FormErrorMessage>
              {error}
            </FormErrorMessage>
          )}
        </VStack>
      </FormControl>

      <Center mt={5} >
        {busy ? <Spinner />
          : (approved ? <Button onClick={onSend}>Send</Button>
            : <Button onClick={onApprove}>Approve</Button>)
        }
      </Center>
    </Container>
  )
}

const tabs = [
  {
    name: 'TOKEN',
    component: (props) => <SendToken {...props} />
  },
  {
    name: 'NFT',
    component: (props) => <SendNFT {...props} />
  },
  {
    name: 'STREAM',
    component: (props) => <>3</>
  },
]

const SendModal = () => {
  const disclosure = useDisclosure()

  const [tabIndex, setTabIndex] = useState(0)

  return (
    <BaseModal disclosure={disclosure} icon={IoRocketOutline}>
      <Container centerContent>
        <ModalHeader fontSize={'3xl'}>🚛 Send</ModalHeader>

        <Tabs variant='soft-rounded' colorScheme='green' onChange={(index) => setTabIndex(index)}>
          <TabList gap={5} justifyContent='space-evenly' width='100%'>
            {tabs.map(tab => <Tab key={tab.name}>{tab.name}</Tab>)}
          </TabList>
          <TabPanels>
            {/* <BusyContext.Provider value={{ busy, setBusy }}> */}
            {tabs.map(tab => <TabPanel key={tab.name} >{tab.component({ disclosure })}</TabPanel>)}
            {/* </BusyContext.Provider> */}
          </TabPanels>
        </Tabs>
      </Container>
    </BaseModal>
  )
}

export default SendModal;
