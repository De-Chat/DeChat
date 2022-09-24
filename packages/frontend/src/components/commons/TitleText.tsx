import { Text } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const TitleText: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <Text as="strong" color="primary" fontSize="3xl">
      {children}
    </Text>
  );
};
