import Script from 'next/script';
import { useEffect, useState } from 'react';

const Unlock = (): JSX.Element => {
  const [unlockProtocol, setUnlockProtocol] = useState<any>(undefined);
  const [locked, setLocked] = useState({ locked: 'locked' }); // 3 states: pending, locked, unlocked

  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).unlockProtocolConfig = {
        network: 5, // Network ID (1 is for mainnet, 4 for rinkeby, 100 for xDai, etc)
        locks: {
          '0xCc197E09b3eDFFf375acEBaeb46285879CAE496c': {
            name: 'Test Lock',
          },
        },
        icon: 'https://unlock-protocol.com/static/images/svg/unlock-word-mark.svg',
        callToAction: {
          default: 'Test Lock!',
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
        <div onClick={checkOut} style={{ cursor: 'pointer' }}>
          Unlock me!{' '}
          <span aria-label="locked" role="img">
            🔒
          </span>
        </div>
      )}
      {locked.locked === 'unlocked' && (
        <div>
          Unlocked!{' '}
          <span aria-label="unlocked" role="img">
            🗝
          </span>
        </div>
      )}
    </div>
  );
};

export default Unlock;