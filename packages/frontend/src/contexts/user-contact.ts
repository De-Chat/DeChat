import { UserContactModel } from '@services/user-contact.service';
import { Connection } from '@tableland/sdk';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface UserContactContextData {
  connection: Connection;
  userContactTableId: string;
  setUserContactTableId: Dispatch<SetStateAction<string | undefined>>;
  currentContacts: UserContactModel[];
  setCurrentContacts: Dispatch<SetStateAction<UserContactModel[] | undefined>>;
}

export const UserContactContext = createContext<
  Partial<UserContactContextData>
>({});
