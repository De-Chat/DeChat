import { ChainName, connect, Connection, NetworkName, ReadQueryResult } from '@tableland/sdk';


export interface UserContactModel {
  address: string;
  name: string;
  id: number;
}

/**
 * Process raw query results into its represented model
 * @param result 
 * @returns {UserContactModel} UserContactModel
 */
export const rawToModel = (result: ReadQueryResult) => {
  return result.rows.map((row) => {
    const newEntry: Partial<UserContactModel> = {};
    result.columns.forEach((col, idx) => {
      newEntry[col.name as keyof UserContactModel] = row[idx] 
    })

    return newEntry as UserContactModel
  })
}

export const createContactTable = async (tableland: Connection) => {
  const contactTable = await tableland.create(
    `
    address TEXT,
    name TEXT,
    id INT UNIQUE,
    primary key (id)
  `,
    { prefix: 'contact_' }
  );

  return contactTable.name;
};

export const loadContacts = async (tableland: Connection, tableId: string) => {
  const myContacts = await tableland.read(`select * from ${tableId}`);

  return rawToModel(myContacts);
}

export const getNextId = async (tableland: Connection, tableId: string): Promise<number> => {
  const res = await tableland.read(`select id from ${tableId} order by id desc limit 1`);
  return (res.rows.length > 0 && res.rows[0].length > 0 ? res.rows[0][0] : 1) as number;
}

export const addContact = async (
  tableland: Connection,
  tableId: string,
  contact: Omit<UserContactModel, 'id'>
) => {
  const id = await getNextId(tableland, tableId);

  
  return tableland.write(
    `INSERT INTO ${tableId} (id, address, name) VALUES (${id}, '${contact.address}', '${contact.name}')`
  );
}

export const removeContact = async (tableland: Connection, tableId: string, address: string) => {
  return tableland.write(
    `DELETE FROM ${tableId} where address = '${address}'`
  );
}

export const updateContact = async (tableland: Connection, tableId: string, address: string, name: string) => {
  return tableland.write(
    ` UPDATE ${tableId} SET name = '${name}' WHERE  address = '${address}' `
  );
}
