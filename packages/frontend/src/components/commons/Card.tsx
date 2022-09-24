import { Box, BoxProps,useColorModeValue } from '@chakra-ui/react';

export const Card = (props: BoxProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  return <Box {...props} bg={bgColor} />;
};

export default Card;
