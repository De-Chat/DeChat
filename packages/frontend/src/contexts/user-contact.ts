import { UserContactService } from '@services/user-contact.service';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface UserContactContextData {
  service: UserContactService;
  userContactTableId: string;
  setUserContactTableId: Dispatch<SetStateAction<string | undefined>>;
}

export const UserContactContext = createContext<
  Partial<UserContactContextData>
>({});
