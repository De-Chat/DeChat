import Blockies from 'react-blockies';

import useEns from '../../hooks/useEns';

type AvatarProps = {
  addressOrName: string;
};

const Avatar: React.FC<AvatarProps> = ({ addressOrName }) => {
  const { ensAvatar, isLoadingAvatar } = useEns(addressOrName);
  return ensAvatar && !isLoadingAvatar ? (
    <img
      className={'rounded-full h-10 w-10'}
      src={ensAvatar}
      alt={addressOrName}
    />
  ) : (
    /**
     * The toLowerCase here is needed to generate a consistent avatar regardless of
     * the casing.
     */
    <Blockies
      seed={addressOrName.toLowerCase()}
      size={10}
      className="rounded-full"
    />
  );
};

export default Avatar;
