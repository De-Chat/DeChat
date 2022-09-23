import { useContext } from 'react';
import { UserContactContext } from 'src/contexts/user-contact';

export const useUserContact = () => {
  const { service } = useContext(UserContactContext);
  return service;
};
