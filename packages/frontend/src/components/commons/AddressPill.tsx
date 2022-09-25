import { classNames } from '@helpers/classNames';
import React from 'react';

import Address from './Address';

type addressPillProps = {
  address: string;
  userIsSender: boolean;
};

const AddressPill = ({
  address,
  userIsSender,
}: addressPillProps): JSX.Element => {
  return (
    <Address
      className={classNames(
        'rounded-2xl',
        'border',
        'text-md',
        'mr-2',
        'px-2',
        'py-1',
        'font-bold',
        'text-b-600',
        userIsSender ? 'bg-bt-100' : 'bg-zinc-50',
        userIsSender ? 'border-bt-300' : 'border-gray-300'
      )}
      address={address}
    />
  );
};

export default AddressPill;
