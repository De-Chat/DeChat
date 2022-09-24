import { UserContactContext } from '@contexts/user-contact';
import { UserContactService } from '@services/user-contact.service';
import React, { useState } from 'react';

export const TablelandProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tableId, setTableId] = useState<string>();

  return (
    <UserContactContext.Provider
      value={{
        service: new UserContactService(),
        setUserContactTableId: setTableId,
        userContactTableId: tableId,
      }}
    >
      {children}
    </UserContactContext.Provider>
  );
};
