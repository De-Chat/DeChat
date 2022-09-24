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
  useContext,
  useEffect,
  useState,
} from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { UserContactContext } from 'src/contexts/user-contact';

import BaseModal from './BaseModal';

const AddToContactModal = ({
  peerAddress,
}: {
  peerAddress: string;
}): JSX.Element => {
  const disclosure = useDisclosure();

  const [input, setInput] = useState<string>();
  const [busy, setBusy] = useState(false);
  const userContactContext = useContext(UserContactContext);

  const handleInputChange = (e: any) => setInput(e.target.value);
  const onSubmit = async (e: SyntheticEvent) => {
    debugger;
    e.preventDefault();
    if (!input) {
      return;
    }
    setBusy(true);
    const service = userContactContext.service!;
    await service.addContact(userContactContext.userContactTableId!, {
      address: peerAddress,
      name: input,
    });
    setBusy(false);
    disclosure.onClose();
  };

  const onUpdate = async (e: SyntheticEvent) => {
    debugger;
    e.preventDefault();
    if (!input) {
      return;
    }
    setBusy(true);
    // TODO: write to tableland
    const service = userContactContext.service!;
    await service.updateContract(
      userContactContext.userContactTableId!,
      peerAddress,
      input
    );
    setBusy(false);
    disclosure.onClose();
  };

  const onDelete = async (e: SyntheticEvent) => {
    debugger;
    e.preventDefault();
    if (!input) {
      return;
    }
    setBusy(true);
    const service = userContactContext.service!;
    await service.removeContact(
      userContactContext.userContactTableId!,
      peerAddress
    );
    setBusy(false);
    disclosure.onClose();
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
            <form>
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
              <>
                <Button variant="ghost" disabled={isError} onClick={onSubmit}>
                  Add
                </Button>
                <Button onClick={onUpdate}>Update</Button>
                {/* <Button onClick={onDelete}>Delete</Button> */}
              </>
            )}
          </ModalFooter>
        </Container>
      </BaseModal>
    </>
  );
};

export default AddToContactModal;
