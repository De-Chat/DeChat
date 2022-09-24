import { UserContactContext } from '@contexts/user-contact';
import * as service from '@services/user-contact.service';
import { useCallback, useContext, useState } from 'react';

export const useUserContact = () => {
  const {
    connection,
    setUserContactTableId,
    userContactTableId,
    currentContacts,
    setCurrentContacts,
  } = useContext(UserContactContext);

  // Initialize function, should only be called once.
  const initializeUserContact = useCallback(async () => {
    if (connection && setUserContactTableId) {
      const allTables = await connection.list();

      if (allTables.length > 0) {
        const tableId = allTables.find((t) =>
          t.name.startsWith('contact_')
        )?.name;

        if (tableId !== undefined) {
          setUserContactTableId(tableId);
          return;
        }
      }

      const newTableId = await service.createContactTable(connection);
      setUserContactTableId(newTableId);
    }
  }, [connection, setUserContactTableId]);

  // Other functions
  const loadContacts = useCallback(async () => {
    console.log(connection, userContactTableId, setCurrentContacts)
    if (connection && userContactTableId && setCurrentContacts) {
      const contacts = await service.loadContacts(
        connection,
        userContactTableId
      );
      setCurrentContacts(contacts);
      console.log(contacts)
      return contacts;
    }
  }, [connection, userContactTableId, setCurrentContacts]);

  const addContact = useCallback(
    (contact: Omit<service.UserContactModel, 'id'>) => {
      if (connection && userContactTableId) {
        return service.addContact(connection, userContactTableId, contact);
      }
      return undefined;
    },
    [connection, userContactTableId]
  );

  const removeContact = useCallback(
    (address: string) => {
      if (connection && userContactTableId) {
        return service.removeContact(connection, userContactTableId, address);
      }
      return undefined;
    },
    [connection, userContactTableId]
  );

  const updateContact = useCallback(
    (address: string, name: string) => {
      if (connection && userContactTableId) {
        return service.updateContact(
          connection,
          userContactTableId,
          address,
          name
        );
      }
      return undefined;
    },
    [connection, userContactTableId]
  );

  const getContactNameByAddress = useCallback(
    (address: string) => {
      if (connection && currentContacts && currentContacts.length > 0) {
        return currentContacts.find((c) => c.address === address)?.name;
      }
      return undefined;
    },
    [connection, currentContacts]
  );

  return {
    currentContacts,
    initializeUserContact,
    loadContacts,
    addContact,
    removeContact,
    updateContact,
    getContactNameByAddress
  };
};
