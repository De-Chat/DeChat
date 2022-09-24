import { UserContactContext } from '@contexts/user-contact';
import { connect, Connection } from '@tableland/sdk';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';

export const UserContactProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [connection, setConnection] = useState<Connection>();
  const [tableId, setTableId] = useState<string>();

  const { data: signer } = useSigner();

  // For establishing a new connection.
  useEffect(() => {
    const asyncFn = async () => {
      if (signer !== undefined && signer !== null) {
        console.log('?????????')
        const newConnection = await connect({
          network: 'testnet',
          chain: 'polygon-mumbai',
          signer: signer,
        });

        setConnection(newConnection);
      }
    };

    asyncFn();
  }, [signer]);

  return (
    <UserContactContext.Provider
      value={{
        connection,
        setUserContactTableId: setTableId,
        userContactTableId: tableId,
      }}
    >
      {children}
    </UserContactContext.Provider>
  );
};
