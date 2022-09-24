import { Resolution } from '@unstoppabledomains/resolution';
import { useEffect, useState } from 'react';

const useUnsAvatar = (domain?: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string>();

  useEffect(() => {
    const fn = async () => {
      const resolution = new Resolution();
      if (domain !== undefined) {
        try {
          const data = await resolution.tokenURIMetadata(domain);
          if (data !== undefined) {
            setAvatarUrl(data.image);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fn();
  }, [domain]);

  return avatarUrl;
};

export default useUnsAvatar;
