import { useDomainName } from '@hooks/useDomainName';
import { classNames } from '../helpers';

type AddressProps = {
  address: string;
  className?: string;
};

const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const {isLoading, domain, resolveDomainName } = useDomainName();
  resolveDomainName(address);

  return (
    <span className={classNames(className || '', 'font-mono')} title={address}>

      {domain?.ensName && 
      <img className="h-4 mr-1 w-auto inline-block" src="/ens-icon.png" alt="ENS" /> || 
      domain?.udName && 
      <img className="h-4 mr-1 w-auto inline-block" src="/ud-icon.png" alt="UD" />}

      {domain?.ensName || domain?.udName || shortAddress(address)}

    </span>
  );
};

export default Address;
