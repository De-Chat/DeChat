import { Icon, IconButton, useColorMode } from '@chakra-ui/react';
import { useMemo } from 'react';
import { BsMoonStars, BsSun } from 'react-icons/bs';

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const buttonIcon = useMemo(
    () => (colorMode == 'light' ? BsSun : BsMoonStars),
    [colorMode]
  );

  return (
    <IconButton
      aria-label="Toggle theme"
      variant="outline"
      border="none"
      icon={<Icon as={buttonIcon} />}
      onClick={toggleColorMode}
    >
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    </IconButton>
  );
};

export default ThemeToggler;
