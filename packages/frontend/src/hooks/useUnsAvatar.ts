import { Resolution } from '@unstoppabledomains/resolution';
import { useState } from 'react';

const useUnsAvatar = (domain: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const resolution = new Resolution();

  resolution
    .tokenURIMetadata(domain)
    .then((data) => {
      setAvatarUrl(data.image_url);
    })
    .catch((err) => console.log('No avatar found for', domain));

  return avatarUrl;
};

export default useUnsAvatar;
