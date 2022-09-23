import { Button, ButtonProps } from '@chakra-ui/react';

export const BaseButton = ({ children, ...otherProps }: ButtonProps) => {
  return (
    <Button
      {...otherProps}
      bg="primary"
      _hover={{ bg: 'primaryDark' }}
      _pressed={{ bg: 'primaryDarker' }}
    >
      {children}
    </Button>
  );
};
