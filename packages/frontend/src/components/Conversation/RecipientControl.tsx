import AddToContactModal from '@components/Modals/AddToContactModal';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import useEns from '../../hooks/useEns';
import useXmtp from '../../hooks/useXmtp';
import AddressInput from '../AddressInput';

import { useDomainName }  from '@hooks/useDomainName';

type RecipientInputProps = {
  peerAddressOrName: string | undefined;
  onSubmit: (address: string) => Promise<void>;
};

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
  NotOnNetwork: 4,
};

const RecipientControl = ({
  peerAddressOrName,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { client } = useXmtp();
  const router = useRouter();
  const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry
  );
  const [pendingPeerAddressOrName, setPendingPeerAddressOrName] =
    useState<string>('');

  const { isLoading, domain, resolveDomainName } = useDomainName();
  resolveDomainName(pendingPeerAddressOrName);

  const checkIfOnNetwork = useCallback(
    async (pendingAddress: string): Promise<boolean> => {
      return client?.canMessage(pendingAddress) || false;
    },
    [client]
  );

  const completeSubmit = useCallback(async () => {
    const checkAddress = domain?.ensAddress || domain?.udAddress
    if (await checkIfOnNetwork(checkAddress as string)) {
      onSubmit(checkAddress as string);
      setRecipientInputMode(RecipientInputMode.Submitted);
    } else {
      setRecipientInputMode(RecipientInputMode.NotOnNetwork);
    }
  }, [checkIfOnNetwork, domain, onSubmit]);

  // const completeSubmit = useCallback(async () => {
  //   if (await checkIfOnNetwork(pendingAddress as string)) {
  //     onSubmit(pendingPeerAddressOrName);
  //     setRecipientInputMode(RecipientInputMode.Submitted);
  //   } else {
  //     setRecipientInputMode(RecipientInputMode.NotOnNetwork);
  //   }
  // }, [checkIfOnNetwork, pendingAddress, pendingPeerAddressOrName, onSubmit]);

  useEffect(() => {
    const handleRecipientInput = () => {
      if (peerAddressOrName) {
        setRecipientInputMode(RecipientInputMode.Submitted);
      } else if (isLoading) {
        setRecipientInputMode(RecipientInputMode.FindingEntry);
      } else if (pendingPeerAddressOrName) {
        completeSubmit();
        setPendingPeerAddressOrName('');
      } else {
        setRecipientInputMode(RecipientInputMode.InvalidEntry);
      }
    };
    handleRecipientInput();
  }, [
    peerAddressOrName,
    isLoading,
    pendingPeerAddressOrName,
    setRecipientInputMode,
    completeSubmit,
  ]);

  // const handleSubmit = useCallback(
  //   async (e: React.SyntheticEvent, value?: string) => {
  //     e.preventDefault();
  //     const data = e.target as typeof e.target & {
  //       input: { value: string };
  //     };
  //     const inputValue = value || data.input.value;
  //     resolveDomainName(inputValue);
  //     setPendingPeerAddressOrName(inputValue);
  //     console.log("htest2a handleSubmit inputValue", inputValue)
  //     console.log("htest2b handleSubmit domain", domain)
  //     console.log("htest2c handleSubmit pendingPeerAddressOrName", pendingPeerAddressOrName)
  //   },
  //   []
  // );

  const handleSubmit = (e: React.SyntheticEvent, value?: string) => {
    e.preventDefault();
    const data = e.target as typeof e.target & {
      input: { value: string };
    };
    const inputValue = value || data.input.value;
    // resolveDomainName(inputValue);
    setPendingPeerAddressOrName(inputValue);
    console.log("htest2a handleSubmit inputValue", inputValue)
    console.log("htest2b handleSubmit domain", domain)
    console.log("htest2c handleSubmit pendingPeerAddressOrName", pendingPeerAddressOrName)
  }

  // const handleInputChange = async (e: React.SyntheticEvent) => {
  //   const data = e.target as typeof e.target & {
  //     value: string;
  //   };
  //   if (router.pathname !== '/dm/') {
  //     router.push('/dm');
  //   }
  //   if (
  //     data.value.endsWith('.eth') || data.value.endsWith('.wallet') || //TODO: add more domains
  //     (data.value.startsWith('0x') && data.value.length === 42)
  //   ) {
  //     console.log("htest1 handleInputChange", data.value);
  //     handleSubmit(e, data.value);
  //   } else {
  //     setRecipientInputMode(RecipientInputMode.InvalidEntry);
  //   }
  // };
  const handleInputChange = (e: React.SyntheticEvent) => {
    const data = e.target as typeof e.target & {
      value: string;
    };
    if (router.pathname !== '/dm/') {
      router.push('/dm');
    }
    if (
      data.value.endsWith('.eth') || data.value.endsWith('.wallet') || //TODO: add more domains
      (data.value.startsWith('0x') && data.value.length === 42)
    ) {
      console.log("htest1a handleInputChange", data.value);
      setPendingPeerAddressOrName(data.value);
      console.log("htest1b pendingPeerAddressOrName", pendingPeerAddressOrName);
      handleSubmit(e, data.value);
    } else{
      setRecipientInputMode(RecipientInputMode.InvalidEntry);
    }
  };

  return (
    <div className="flex-1 flex-col shrink justify-center flex h-[72px] bg-zinc-50 md:border-b md:border-gray-200 md:px-4 md:pb-[2px]">
      <form
        className="w-full flex pl-2 md:pl-0 h-8 pt-1"
        action="#"
        method="GET"
        onSubmit={handleSubmit}
      >
        <label htmlFor="recipient-field" className="sr-only">
          Recipient
        </label>
        <div className="relative w-full text-n-300 focus-within:text-n-600">
          <div className="absolute top-1 left-0 flex items-center pointer-events-none text-md md:text-sm font-medium md:font-semibold">
            To:
          </div>
          <AddressInput
            peerAddressOrName={peerAddressOrName}
            id="recipient-field"
            className="block w-[95%] pl-7 pr-3 pt-[3px] md:pt-[2px] md:pt-[1px] bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-lg font-mono"
            name="recipient"
            onInputChange={handleInputChange}
          />
          <AddToContactModal peerAddress={peerAddressOrName || ''} />
          <button type="submit" className="hidden" />
        </div>
      </form>

      {recipientInputMode === RecipientInputMode.Submitted ? (
        <div className="text-md text-n-300 text-sm font-mono ml-10 md:ml-8 pb-1 md:pb-[1px]">
          {(domain?.ensName || domain?.udName) ? (domain?.ensAddress || domain?.udAddress) : <br />}
        </div>
      ) : (
        <div className="text-sm md:text-xs text-n-300 ml-[29px] pl-2 md:pl-0 pb-1 md:pb-[3px]">
          {recipientInputMode === RecipientInputMode.NotOnNetwork &&
            'Recipient is not on the XMTP network'}
          {recipientInputMode === RecipientInputMode.FindingEntry &&
            'Finding ENS domain...'}
          {recipientInputMode === RecipientInputMode.InvalidEntry &&
            'Please enter a valid wallet address'}
          {recipientInputMode === RecipientInputMode.ValidEntry && <br />}
        </div>
      )}
    </div>
  );
};

export default RecipientControl;
