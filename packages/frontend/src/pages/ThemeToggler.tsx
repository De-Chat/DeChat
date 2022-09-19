import { IconButton, Icon, useColorMode } from '@chakra-ui/react';
import { useMemo } from 'react';
import {BsSun, BsMoonStars} from 'react-icons/bs'

export default () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const buttonIcon = useMemo(() => colorMode == 'light' ? BsSun : BsMoonStars, [colorMode])

  return (
      <IconButton aria-label='Toggle theme' variant='outline' border='none' icon={<Icon as={buttonIcon} />} onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </IconButton>
  );
};
