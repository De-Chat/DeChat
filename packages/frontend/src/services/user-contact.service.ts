import { ChainName, connect, Connection, NetworkName } from "@tableland/sdk";

export class UserContactService {
  private connection?: Connection;

  async getConnection(): Promise<Connection> {
    if (this.connection === undefined) {
      this.connection = await connect({
        network: 'testnet',
        chain: 'polygon-mumbai'
      });
    }
    return this.connection;
  };

  async connectToTableland() {
    const tableland = await this.getConnection();
    tableland.siwe();

    const allTables = await tableland.list();
    return allTables.find((t) => t.name.startsWith('contact_'))
  }


  async createContactTable() {
    const tableland = await this.getConnection();
    const contactTable = await tableland.create(`
      address TEXT,
      name TEXT,
      id INT UNIQUE,
    `, { prefix: 'contact_' })

    return contactTable.name;
  }

  async loadContacts(tableId: string) {
    const tableLand = await this.getConnection();
    const myContacts = await tableLand.read(`select * from ${tableId}`)

    return myContacts;
  }

  async addContact(tableId: string, contact: { address: string, name: string }) {
    const tableland = await this.getConnection();
    return tableland.write(`INSERT INTO ${tableId} (address, name) VALUES (${contact.address}, ${contact.name})`)
  }

  async removeContact(tableId: string, address: string) {
    const tableland = await this.getConnection();
    return tableland.write(`DELETE FROM ${tableId} where address = ${address}`)
  }
}

