import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const DepositProfile = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  return (
    <>
      <Box ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        Some other content that'll receive focus on close.
      </Box>

      <Button mt={4} onClick={onOpen}>
        Deposit
      </Button>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div>Deposited</div>
            <div>$475.34</div>
            <Divider />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>Borrowers</Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="center">See more...</Flex>
            </Box>

            <Divider />
            <Box>You Owe</Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="space-evenly">
                <Box>PFP</Box>
                <Box>someone.eth</Box>
                <Box>$103</Box>
                <Box>Ether logo</Box>
              </Flex>
            </Box>
            <Box>
              <Flex justify="center">See more...</Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DepositProfile;
