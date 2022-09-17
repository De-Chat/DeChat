import { Box, useColorModeValue, useStyleConfig } from '@chakra-ui/react'
import { BoxProps } from '@chakra-ui/react'

function Card(props: BoxProps) {
  const { ...rest } = props
  const bgColor = useColorModeValue('white', 'gray.700')
  return <Box bg={bgColor} {...rest} />
}

export default Card
