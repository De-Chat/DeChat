import { useDeployments } from '@shared/useDeployments';
import { chainId, useAccount, useContractRead, useNetwork, erc20ABI, useProvider, useBlockNumber, useContract } from 'wagmi';
import { Send__factory } from '@dechat/contracts/typechain-types';
import useXmtp from '../../hooks/useXmtp';
import React, { createContext, SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import BaseModal from './BaseModal';
import { Button, Center, Checkbox, Container, Flex, FormControl, FormErrorMessage, HStack, IconButton, Input, ModalFooter, ModalHeader, Select, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure, VStack } from '@chakra-ui/react';
import { IoRocketOutline } from 'react-icons/io5'
import { getERC20ByName, getERC20s } from '@deployments/tokenlist';

// helpers
const approve = async (contract: ethers.Contract, address: string, amount: string, decimals: number) => {
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
    const tokenName = e.target.value
    const chainId = chain?.id
    console.log('test select: ', chain?.id, e.target.value, getERC20ByName(chainId, tokenName))
    setForm({ ...form, token: getERC20ByName(chainId, tokenName) })
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
    await approve(tokenContract, contracts?.Send.address, amount, token.decimals)
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
  const tokenlist = useMemo(() => getERC20s(chain?.id) || [], [chain?.id])

  return (
    <Container centerContent>
      <FormControl mt={3} mb={3} onSubmit={onSend}>
        <VStack spacing={4}>
          <Input placeholder='Receiver' name='to' onChange={handleFormChange} />
          <HStack gap={2}>
            <Select placeholder='Token' name='token' onChange={handleSelectChange}>
              {tokenlist.map((token: any) =>
                <option key={token.name} value={token.name}>{token.name.toUpperCase()}</option>
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

const tabs = [
  {
    name: 'TOKEN',
    component: (props) => <SendToken {...props} />
  },
  {
    name: 'NFT',
    component: (props) => <>2</>
  },
  {
    name: 'STREAM',
    component: (props) => <>3</>
  },
]

// const BusyContext = createContext()
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
