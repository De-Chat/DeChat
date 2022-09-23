import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React, {
  type SyntheticEvent,
  useEffect,
  useState,
  useContext,
} from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { UserContactContext } from 'src/contexts/user-contact';
import { useUserContact } from 'src/hooks/user-contact/useUserContact';
import { useAccount } from 'wagmi';

import BaseModal from './BaseModal';

const AddToContactModal = (): JSX.Element => {
  const disclosure = useDisclosure();

  const [input, setInput] = useState<string>();
  const [busy, setBusy] = useState(false);
  const userContactContext = useContext(UserContactContext);
  const { address } = useAccount();

  const handleInputChange = (e: any) => setInput(e.target.value);
  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setBusy(true);
    if (!input) {
      return;
    }
    // TODO: write to tableland
    const service = userContactContext.service!;
    await service.addContact(userContactContext.userContactTableId!, {
      address: address,
      name: input,
    });
    setBusy(false)
    disclosure.onClose()
  };

  useEffect(() => {
    if (!disclosure.isOpen) {
      setInput(undefined);
      setBusy(false);
    }
  }, [disclosure.isOpen]);

  const isError = input === '';

  return (
    <>
      <BaseModal disclosure={disclosure} icon={BiEditAlt}>
        <Container centerContent>
          <ModalHeader fontSize={'3xl'}>Add to Contacts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={isError}>
                <Input
                  type="nickname"
                  value={input}
                  placeholder="Enter nickname.."
                  onChange={handleInputChange}
                />
                {isError && (
                  <FormErrorMessage>
                    Enter a nickname for this contact
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            {busy ? (
              <Spinner />
            ) : (
              <Button variant="ghost" disabled={isError}>
                Add
              </Button>
            )}
          </ModalFooter>
        </Container>
      </BaseModal>
    </>
  );
};

export default AddToContactModal;
