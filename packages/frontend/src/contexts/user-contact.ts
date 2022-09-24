import { Connection } from '@tableland/sdk';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface UserContactContextData {
  connection: Connection,
  userContactTableId: string;
  setUserContactTableId: Dispatch<SetStateAction<string | undefined>>;
}

export const UserContactContext = createContext<
  Partial<UserContactContextData>
>({});
