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
import { urlPrefix } from '@shared/environment';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import Emoji from 'react-emoji-render';
import { GrTransaction } from 'react-icons/gr';
import { erc20ABI, useContractRead } from 'wagmi';

import { MessageTileProps } from './MessagesList';

export interface Transaction {
  senderAddress: string;
  sent: Date;
  error?: Error;
  content: any; // please refers to output of useGetAllTransfer()
}

const extractImgUrl = (message: string): string | null => {
  const regex = /::image\((.+)\)/;
  const found = message.match(regex);
  return found && found[1];
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
    <LinkBox
      as="article"
      style={{ transitionDuration: '0.15s' }}
      _hover={{ opacity: 0.8 }}
    >
      <LinkOverlay
        href={`${urlPrefix.blockchainExplorer}/tx/${txData.id}`}
        target="_blank"
      />
      <Card padding={5} borderRadius={15}>
        <Flex>
          <Avatar icon={<Icon as={GrTransaction} />} />
          <Box ml="3">
            <Text fontSize="sm">{txData.transferType}</Text>
            <Text fontWeight="bold">
              {parsedAmount} {tokenName}
            </Text>
          </Box>
        </Flex>
      </Card>
    </LinkBox>
  );
};

const MessageRenderer: React.FC<{ messageTileData: MessageTileProps }> = ({
  messageTileData,
}) => {
  const { message, type } = messageTileData;

  if (type == 'message' && 'content' in message) {
    // text and images are "message"
    const imgUrl = extractImgUrl(message.content);
    return message.error ? (
      <span>{`Error: ${message.error?.message}`}</span>
    ) : imgUrl ? (
      <Image
        src={imgUrl}
        width="100px"
        fallbackSrc="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-20.jpg"
      />
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
