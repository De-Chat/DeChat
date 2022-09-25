import { createContext } from 'react';

const VideoCallContext = createContext({
  videoCalling: '',
  setVideoCalling: (state: any) => {},
  peer: '',
  setPeer: (peer: any) => {},
  streamKey: '',
  setStreamKey: (streamKey: string) => {},
  initVideocall: async () => {},
  joinVideocallB: async () => {},
  joinVideocallA: async (playbackIdB: string) => {},
  terminateVideocall: () => {},
});

export default VideoCallContext;
