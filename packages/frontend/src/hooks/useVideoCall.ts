import VideoCallContext from '@contexts/videoCall';
import { useContext } from 'react';

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  return { ...context };
};
