import {
  Avatar,
  Box,
  Flex,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import Card from '@components/Card';
import { ethers } from 'ethers';
import { PropsWithChildren, useMemo } from 'react';
import Emoji from 'react-emoji-render';
import { GrTransaction } from 'react-icons/gr';
import { urlPrefix } from 'src/helpers/environment';
import { erc20ABI, useContractRead } from 'wagmi';

import { decodeMessage } from '../../helpers/message-parser';
import { MessageTileProps } from './MessagesList';

export interface Transaction {
  senderAddress: string;
  sent: Date;
  error?: Error;
  content: any; // please refers to output of useGetAllTransfer()
}

// General Card component, used in other components
const MessageCard: React.FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <LinkBox
      as="article"
      style={{ transitionDuration: '0.15s' }}
      _hover={{ opacity: 0.8 }}
    >
      <LinkOverlay href={href} target="_blank" />
      <Card padding={5} borderRadius={15}>
        <Flex alignItems={'center'}>{children}</Flex>
      </Card>
    </LinkBox>
  );
};

// streamData content could be found at frontend/src/components/Modals/SendModal.tsx sendStream()::payload
const StreamFundTile = ({ streamData }: { streamData: any }) => {
  return (
    <MessageCard
      href={`${urlPrefix.blockchainExplorer}/tx/${streamData.txHash}`}
    >
      <Avatar src="https://app.superfluid.finance/gifs/stream-loop.gif" />
      <Box ml="3">
        <Text fontSize="sm">Superfluid Stream</Text>
        <Text fontWeight="bold">
          {streamData.amount} {streamData.token}
        </Text>
        <Text fontWeight="bold">{streamData.flowrate} / sec</Text>
      </Box>
    </MessageCard>
  );
};

// exmaple data
// {
//     "transferType": "transferERC20S",
//     "chain": "mumbai",
//     "__typename": "TransferERC20",
//     "id": "0x9fa1af30f4234fd2fc79b8ca48ecf105eee2785cbe55dfb2131a72d0d2b8c3d1",
//     "from": "0x0754f7fc90f842a6ace8b6ec89e4edadeb2a9ba5",
//     "to": "0x0754f7fc90f842a6ace8b6ec89e4edadeb2a9ba5",
//     "timestamp": "1663901016",
//     "amount": "100000000000000000",
//     "contractAddress": "0x15f0ca26781c3852f8166ed2ebce5d18265cceb7"
// }
const TransactionBlock: React.FC<{ txData: any }> = ({ txData }) => {
  // parse amount
  const { data: decimals } = useContractRead({
    addressOrName: txData.contractAddress,
    contractInterface: erc20ABI,
    functionName: 'decimals',
  });
  const { data: tokenName } = useContractRead({
    addressOrName: txData.contractAddress,
    contractInterface: erc20ABI,
    functionName: 'name',
  });
  const parsedAmount = useMemo(
    () => ethers.utils.formatUnits(txData.amount, decimals),
    [txData.amount, decimals]
  );
  return (
    <MessageCard href={`${urlPrefix.blockchainExplorer}/tx/${txData.id}`}>
      <Avatar icon={<Icon as={GrTransaction} />} />
      <Box ml="3">
        <Text fontSize="sm">{txData.transferType}</Text>
        <Text fontWeight="bold">
          {parsedAmount} {tokenName}
        </Text>
      </Box>
    </MessageCard>
  );
};

const MessageRenderer: React.FC<{ messageTileData: MessageTileProps }> = ({
  messageTileData,
}) => {
  const { message, type } = messageTileData;

  if (type == 'message' && 'content' in message) {
    // text and images are "message"
    const decodedMsg = decodeMessage(message.content);
    return message.error ? (
      <span>{`Error: ${message.error?.message}`}</span>
    ) : decodedMsg?.command == 'image' ? (
      <Image
        src={decodedMsg.payload.url}
        width="100px"
        fallbackSrc="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-20.jpg"
      />
    ) : decodedMsg?.command == 'streamFund' ? (
      <StreamFundTile streamData={decodedMsg.payload} />
    ) : decodedMsg?.command == 'videoCall' ? (
      // video call logic handler
      <></>
    ) : (
      <Emoji text={message.content || ''} />
    );
  } else if (type == 'transaction') {
    // transaction json are "transaction"
    // this only works for ERC20 now
    return <TransactionBlock txData={message.content} />;
  } else {
    return <div></div>;
  }
};

export default MessageRenderer;
