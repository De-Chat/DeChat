import { ChainName, connect, Connection, NetworkName } from '@tableland/sdk';
import { ethers } from 'ethers';

export class UserContactService {
  private connection?: Connection;

  async getConnection(signer?: ethers.Signer): Promise<Connection> {
    if (this.connection === undefined) {
      this.connection = await connect({
        network: 'testnet',
        chain: 'polygon-mumbai',
        signer: signer,
      });
    }
    return this.connection;
  }

  async connectToTableland(signer?: ethers.Signer) {
    const tableland = await this.getConnection(signer);
    if (!tableland.signer) {
      await tableland.siwe();
    }

    const allTables = await tableland.list();

    // return a tableid
    let tableId = allTables?.find((t) => t.name.startsWith('contact_'))?.name;
    if (!tableId) {
      tableId = await this.createContactTable();
    }
    return tableId;
  }

  async createContactTable() {
    const tableland = await this.getConnection();
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
  }

  async loadContacts(tableId: string) {
    const tableLand = await this.getConnection();
    const myContacts = await tableLand.read(`select * from ${tableId}`);

    return myContacts;
  }

  async addContact(
    tableId: string,
    contact: { address: string; name: string }
  ) {
    const tableland = await this.getConnection();

    const res = await this.loadContacts(tableId);
    const id = res.rows.length;

    return tableland.write(
      `INSERT INTO ${tableId} (id, address, name) VALUES (${id}, '${contact.address}', '${contact.name}')`
    );
  }

  async removeContact(tableId: string, address: string) {
    const tableland = await this.getConnection();
    return tableland.write(`DELETE FROM ${tableId} where address = '${address}'`);
  }

  async updateContract(tableId: string, address: string, name: string) {
    const tableland = await this.getConnection();
    return tableland.write(
      ` UPDATE ${tableId} SET name = '${name}' WHERE  address = '${address}' `
    );
  }
}
