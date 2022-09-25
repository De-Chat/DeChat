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
import Card from '@components/commons/Card';
import { urlPrefix } from '@helpers/environment';
import { useVideoCall } from '@hooks/useVideoCall';
import { ethers } from 'ethers';
import { PropsWithChildren, useMemo } from 'react';
import Emoji from 'react-emoji-render';
import { BsCameraVideo } from 'react-icons/bs';
import { GrTransaction } from 'react-icons/gr';
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

const VideoCallTile = ({
  playbackId,
  onClick,
}: {
  playbackId: string;
  onClick: (arg0: string) => void;
}) => {
  return (
    <Card
      padding={5}
      borderRadius={15}
      onClick={() => onClick(playbackId)}
      _hover={{ opacity: 0.8 }}
    >
      <Flex alignItems={'center'}>
        <Avatar icon={<Icon as={BsCameraVideo} />} />
        <Box ml="3">
          <Text fontSize="sm">Join Video Call</Text>
          <Text fontWeight="bold">{playbackId}</Text>
        </Box>
      </Flex>
    </Card>
  );
};

const videocallLogicHandler = (payload: object) => {};

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

  // videoCall handler
  const videocall = useVideoCall();

  if (type == 'message' && 'content' in message) {
    const decodedMsg = decodeMessage(message.content);
    // text and images are "message"
    if (message.error) return <span>{`Error: ${message.error?.message}`}</span>;
    else if (decodedMsg?.command == 'image')
      return (
        <Image
          src={decodedMsg.payload.url}
          width="100px"
          fallbackSrc="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-20.jpg"
        />
      );
    else if (decodedMsg?.command == 'streamFund')
      return <StreamFundTile streamData={decodedMsg.payload} />;
    else if (decodedMsg?.command == 'videoCall') {
      try {
        console.log('test videoCall msg: ', decodedMsg);
        const payload = decodedMsg?.payload;
        // video call logic handler
        if (payload.type == 'init') {
          // videocall.initVideocall();
          return (
            <VideoCallTile
              playbackId={payload.playbackIdA}
              onClick={() => {
                videocall.setPeer(payload.playbackIdA);
                videocall.setVideoCalling('B');
              }}
            />
          );
        } else if (payload.type == 'joinB' && videocall.videoCalling == 'A') {
          if (message.sent) {
            const now = new Date();
            const messageSentTime = message.sent.getTime();
            if (now.getTime() - messageSentTime <= 10000) {
              videocall.joinVideocallA(payload.playbackIdB);
            }
          }

          // click to joinVideocallA(payload.playbackIdB);
          return <></>;
        }
      } catch (e) {
        console.warn('Error parsing videoCall message: ', e);
      }
    } else return <Emoji text={message.content || ''} />;
  } else if (type == 'transaction') {
    // transaction json are "transaction"
    // this only works for ERC20 now
    return <TransactionBlock txData={message.content} />;
  }
  return <></>;
};

export default MessageRenderer;
