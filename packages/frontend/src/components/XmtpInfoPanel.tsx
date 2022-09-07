import packageJson from '../../package.json'
import Image from 'next/image'
import Robot from 'public/robot.gif'
import useXmtp from '../hooks/useXmtp'
import { classNames } from '../helpers'
import {
  LinkIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/solid'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type XmtpInfoRowProps = {
  icon: JSX.Element
  headingText: string
  subHeadingText: string
  onClick?: (() => void) | (() => Promise<void>)
  disabled?: boolean
}

type XmtpInfoPanelProps = {
  onConnect?: () => Promise<void>
}

const InfoRow = ({
  icon,
  headingText,
  subHeadingText,
  onClick,
  disabled,
}: XmtpInfoRowProps): JSX.Element => (
  <a
    onClick={disabled ? undefined : onClick}
    className={disabled ? 'cursor-auto' : 'cursor-pointer'}
  >
    <div
      className={classNames(
        disabled ? 'opacity-40' : '',
        'flex py-4 border border-x-0 border-y-zinc-50 justify-between items-stretch text-left'
      )}
    >
      <div className="h-10 w-10 bg-l-300 rounded-lg text-white p-2">{icon}</div>
      <div className="ml-3 flex-col justify-center text-md flex-1">
        <div className="font-semibold text-n-600">{headingText}</div>
        <div className="text-n-300">{subHeadingText}</div>
      </div>
      <div className="w-10 flex justify-end items-center pr-2">
        <ChevronRightIcon className="h-5" />
      </div>
    </div>
  </a>
)

const XmtpInfoPanel = ({ onConnect }: XmtpInfoPanelProps): JSX.Element => {
  const { walletAddress, client } = useXmtp()
  // const InfoRows = [
  //   {
  //     icon: <LinkIcon />,
  //     headingText: 'Connect your wallet',
  //     subHeadingText: 'Connect!',
  //     onClick: () => { },
  //     disabled: !!walletAddress && !client,
  //   },
  // ]

  return (
    // The info panel is only shown in desktop layouts.
    <div className="hidden md:block m-auto w-[464px]">
      <div className="pb-6">
        <div className="text-xl text-n-600 font-semibold mb-1">
          Welcome to the web3 communication protocol
        </div>
        <div className="text-md text-n-300">
          Get started by reading the docs or joining the community
        </div>
      </div>
      <div>
        <Image src={Robot} />
        <div className="mt-2 flex justify-center">
        <ConnectButton
          // accountStatus="address"
          // chainStatus="none"
          // showBalance={false}
        />
        </div>
        {/* {InfoRows.map((info, index) => {
          return (
            <InfoRow
              key={index}
              icon={info.icon}
              headingText={info.headingText}
              subHeadingText={info.subHeadingText}
              onClick={info.onClick}
              disabled={info.disabled}
            />
          )
        })} */}
      </div>
    </div>
  )
}

export default XmtpInfoPanel
