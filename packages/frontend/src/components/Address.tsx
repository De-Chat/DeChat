import { classNames } from '../helpers'
import { useEnsName } from 'wagmi'

type AddressProps = {
  address: string
  className?: string
}

const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const { data: ensName } = useEnsName({ address })
  return (
    <span className={classNames(className || '', 'font-mono')} title={address}>
      {ensName || shortAddress(address)}
    </span>
  )
}

export default Address
