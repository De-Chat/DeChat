import { classNames } from '@helpers/classNames';
import useEns from '@hooks/useEns';
import useXmtp from '@hooks/useXmtp';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type AddressInputProps = {
  peerAddressOrName?: string;
  id?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  onInputChange?: (e: React.SyntheticEvent) => void;
};

const AddressInput = ({
  peerAddressOrName,
  id,
  name,
  className,
  placeholder,
  onInputChange,
}: AddressInputProps): JSX.Element => {
  const { walletAddress } = useXmtp();
  const inputElement = useRef(null);

  const { ensName, address } = useEns(peerAddressOrName);
  const [resolvedNameOrAddress, setResolvedNameOrAddress] = useState<
    string | undefined
  >(ensName || address);
  const [value, setValue] = useState<string>('');

  const focusInputElementRef = useCallback(() => {
    (inputElement.current as any)?.focus();
  }, [inputElement]);

  const blurInputElementRef = useCallback(() => {
    (inputElement.current as any)?.blur();
  }, [inputElement]);

  useEffect(() => {
    setResolvedNameOrAddress(ensName || address);
  }, [setResolvedNameOrAddress, ensName, address]);

  useEffect(() => {
    if (resolvedNameOrAddress) {
      setValue(resolvedNameOrAddress);
      blurInputElementRef();
    } else {
      focusInputElementRef();
      setValue('');
    }
  }, [
    focusInputElementRef,
    blurInputElementRef,
    resolvedNameOrAddress,
    peerAddressOrName,
  ]);

  const userIsSender = address === walletAddress;

  const recipientPillInputStyle = classNames(
    'absolute',
    'top-[4px] md:top-[2px]',
    'left-[26px] md:left-[23px]',
    'rounded-2xl',
    'px-[5px] md:px-2',
    'border',
    'text-md',
    'focus:outline-none',
    'focus:ring-0',
    'font-bold',
    'font-mono',
    'overflow-visible',
    'text-center',
    'text-transparent',
    'select-none',
    userIsSender ? 'bg-bt-100' : 'bg-zinc-50',
    userIsSender ? 'border-bt-300' : 'border-gray-300'
  );

  const onAddressChange = useCallback(
    async (event: React.SyntheticEvent) => {
      if (!onInputChange) return;
      const data = event.target as typeof event.target & {
        value: string;
      };
      setValue(data.value.trim());
      onInputChange(event);
    },
    [onInputChange]
  );

  return (
    <div className="relative mb-5">
      {peerAddressOrName && value && (
        <span className={recipientPillInputStyle}>{value}</span>
      )}
      <input
        id={id}
        name={name}
        className={classNames(
          className || '',
          'absolute top-0 left-0',
          userIsSender ? '!text-b-600' : '',
          peerAddressOrName ? '!text-md font-bold top-[2px] left-1' : ''
        )}
        placeholder={placeholder}
        onChange={onAddressChange}
        value={value}
        ref={inputElement}
        autoComplete="off"
      />
    </div>
  );
};

export default AddressInput;
