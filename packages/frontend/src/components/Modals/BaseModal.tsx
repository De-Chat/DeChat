import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalCloseButton, ModalContent, ModalOverlay, Icon, type UseDisclosureProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { IconType } from 'react-icons';

const BaseModal: React.FC<{ disclosure: UseDisclosureProps, children: React.ReactNode, icon: IconType }> = ({ disclosure, children, icon }) => {
  const { isOpen, onOpen, onClose } = disclosure
  return (
    <>
      <IconButton onClick={onOpen} icon={<Icon as={icon} />} variant="outline" border={"none"} aria-label='Upload image'>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter='blur(5px)' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody margin={"1rem"}>
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseModal