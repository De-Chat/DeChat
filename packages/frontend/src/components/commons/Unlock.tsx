import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Text } from '@chakra-ui/react';

const Unlock = (): JSX.Element => {
  const [unlockProtocol, setUnlockProtocol] = useState<any>(undefined);
  const [locked, setLocked] = useState({ locked: 'locked' }); // 3 states: pending, locked, unlocked

  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).unlockProtocolConfig = {
        network: 5, // Network ID (1 is for mainnet, 4 for rinkeby, 100 for xDai, etc)
        locks: {
          '0xd9C22C8568F5Ef7Fa0a05864A31B2CD83CC7eaBB': {
            name: 'Dechat Premium',
          },
        },
        icon: 'https://unlock-protocol.com/static/images/svg/unlock-word-mark.svg',
        callToAction: {
          default: 'Dechat Premium',
        },
      };

      setUnlockProtocol((window as any).unlockProtocol);
    }
  }, []);

  const unlockHandler = (e: any) => {
    setLocked((state) => {
      return {
        ...state,
        locked: e.detail,
      };
    });
  };

  const checkOut = () => {
    unlockProtocol && unlockProtocol.loadCheckoutModal();
  };

  useEffect(() => {
    window.addEventListener('unlockProtocol', unlockHandler);

    return () => {
      window.removeEventListener('unlockProtocol', unlockHandler);
    };
  }, []);

  return (
    <div>
      <Script
        src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js"
        type="text/javascript"
      />
      {locked.locked === 'locked' && (
        <div className='ml-4 mt-4' onClick={checkOut} style={{ cursor: 'pointer' }}>
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="lg"
            fontWeight="extrabold"
          > Get DeChat Premium 🔒
          </Text>
          {/* Get Dechat Premium{' '}
          <span aria-label="locked" role="img">
            🔒
          </span> */}
        </div>
      )}
      {locked.locked === 'unlocked' && (
        <div className='ml-4 mt-4'>
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="lg"
            fontWeight="extrabold"
          > DeChat Premium 💎
          </Text>
          {/* Premium Member{' '}
          <span aria-label="unlocked" role="img">
            🗝
          </span> */}
        </div>
      )}
    </div>
  );
};

export default Unlock;
