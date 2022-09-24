import React, { useState } from 'react';
import { UserContactContext } from 'src/contexts/user-contact';
import { UserContactService } from 'src/services/user-contact.service';

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
