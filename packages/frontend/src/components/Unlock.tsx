import { useEffect, useState } from 'react';
import {Helmet} from "react-helmet";

const Unlock = (): JSX.Element => {
  
  const [locked, setLocked] = useState(
    {locked: "locked"}
  ); // 3 states: pending, locked, unlocked

  const unlockHandler = (e) => {
    setLocked(state => {
      return {
        ...state,
        locked: e.detail
      }
    });
  }

  const checkOut = () => {
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()
  }

  useEffect(() => {
    let ignore = false;
    if (!ignore){
      window.unlockProtocolConfig = {
        "network": 5, // Network ID (1 is for mainnet, 4 for rinkeby, 100 for xDai, etc)
        "locks": {
          "0xCc197E09b3eDFFf375acEBaeb46285879CAE496c": {
            "name": "Test Lock"
          }
        },
        "icon": "https://unlock-protocol.com/static/images/svg/unlock-word-mark.svg",
        "callToAction": {
          "default": "Test Lock!"
        }
      }

      return () => { ignore = true; }
    }
  }, [])

  useEffect(() => {
    window.addEventListener("unlockProtocol", unlockHandler)

    return () => {
      window.removeEventListener("unlockProtocol", unlockHandler)
    }
  }, [])

  return (
    <div>
      {locked.locked === "locked" && (
        <div onClick={checkOut} style={{ cursor: "pointer" }}>
          Unlock me!{" "}
          <span aria-label="locked" role="img">
            🔒
          </span>
        </div>
      )}
      {locked.locked === "unlocked" && (
        <div>
          Unlocked!{" "}
          <span aria-label="unlocked" role="img">
            🗝
          </span>
        </div>
      )}
      <Helmet>
        <script src=
          "https://paywall.unlock-protocol.com/static/unlock.latest.min.js" 
        type="text/javascript" />
      </Helmet>
    </div>

  );
};

export default Unlock;
