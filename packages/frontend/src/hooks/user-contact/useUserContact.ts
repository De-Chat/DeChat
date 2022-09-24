import { UserContactContext } from '@contexts/user-contact';
import * as service from '@services/user-contact.service';
import { useCallback, useContext, useState } from 'react';

export const useUserContact = () => {
  const { connection, setUserContactTableId, userContactTableId } =
    useContext(UserContactContext);

  // Initialize function, should only be called once.
  const initializeUserContact = useCallback(async () => {
    if (connection && setUserContactTableId) {
      await connection.siwe();

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
  const loadContacts = useCallback(() => {
    if (connection && userContactTableId) {
      return service.loadContacts(connection, userContactTableId);
    }
    return [];
  }, [connection, userContactTableId]);

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

  return {
    initializeUserContact,
    loadContacts,
    addContact,
    removeContact,
    updateContact,
  };
};
