import {
  UserContactContext,
  UserContactContextData,
} from '@contexts/user-contact';
import { useContext, useState } from 'react';

export const useUserContact = (): UserContactContextData | undefined => {
  // const [c, setC] = useState<UserContactContextData | undefined>();
  const context = useContext(UserContactContext);
  if (
    context !== undefined &&
    context.service &&
    context.userContactTableId &&
    context.setUserContactTableId
  ) {
    return context as UserContactContextData;
    // setC(context as UserContactContextData);
  }

  // return c;
  return context as UserContactContextData;
  // throw new Error("No user context provider")
};
