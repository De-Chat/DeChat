import { createContext } from 'react';
import { UserContactService } from 'src/services/user-contact.service';

interface UserContactContextData {
  service: UserContactService;
}

export const UserContactContext = createContext<UserContactContextData>({
  service: new UserContactService(),
});
