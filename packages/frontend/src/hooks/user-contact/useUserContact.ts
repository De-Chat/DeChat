import { useContext } from 'react';
import { UserContactContext, UserContactContextData } from 'src/contexts/user-contact';

export const useUserContact = (): UserContactContextData => {
  const context = useContext(UserContactContext);
  if (
    context !== undefined &&
    context.service &&
    context.userContactTableId &&
    context.setUserContactTableId
  ) {
    return context as UserContactContextData;
  }
  throw new Error("No user context provider")
};
