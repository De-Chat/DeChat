import { Box, Flex, Icon, Image, Text, Avatar, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Emoji from "react-emoji-render"
import { GrTransaction } from 'react-icons/gr'
import { MessageTileProps } from "./MessagesList";
import Card from "@components/Card";

interface ITxData {
    txHash: string,
    amount: number,
    token: string
}

export interface Transaction {
    senderAddress: string,
    sent: Date,
    error?: Error,
    content: ITxData
}

const extractImgUrl = (message: string): string | null => {
    const regex = /::image\((.+)\)/;
    const found = message.match(regex);
    return found && found[1];
}

const TransactionBlock: React.FC<{ txData: ITxData }> = ({ txData }) => {
    return (
        <LinkBox as='article'>
            <LinkOverlay href="https://www.google.com" target='_blank' />
            <Card padding={3} borderRadius={5}>
                <Flex>
                    <Avatar icon={<Icon as={GrTransaction} />} />
                    <Box ml='3'>
                        <Text fontSize='sm'>Transaction</Text>
                        <Text fontWeight='bold'>
                            {txData.amount} {txData.token}
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </LinkBox>
    )
}

const MessageRenderer: React.FC<{ messageTileData: MessageTileProps }> = ({ messageTileData }) => {
    const { message, type } = messageTileData

    if (type == "message" && "content" in message) {
        // text and images are "message"
        const imgUrl = extractImgUrl(message.content)
        return message.error ? (
            <span>{`Error: ${message.error?.message}`}</span>
        ) : imgUrl ? (
            <Image src={imgUrl} width="100px" fallbackSrc="https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-20.jpg" />
        ) : (
            <Emoji text={message.content || ''} />
        )
    } else if (type == "transaction") {
        // transaction json are "transaction"
        return <TransactionBlock txData={message.content} />
    } else {
        return <div></div>
    }
}

export default MessageRenderer