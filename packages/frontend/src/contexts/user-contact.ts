import { createContext, Dispatch, SetStateAction } from 'react';
import { UserContactService } from 'src/services/user-contact.service';

export interface UserContactContextData {
  service: UserContactService;
  userContactTableId: string;
  setUserContactTableId: Dispatch<SetStateAction<string | undefined>>;
}

export const UserContactContext = createContext<
  Partial<UserContactContextData>
>({});
