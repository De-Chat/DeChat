import { encodeMessage } from '@helpers/message-parser';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoCallContext from 'src/contexts/videoCall';

const VideoCallProvider = ({ children, sendMessage }) => {
  const [videoCalling, setVideoCalling] = useState('');
  const [peer, setPeer] = useState('');
  const [streamKey, setStreamKey] = useState(''); //generated for alice to get the playbackID

  ///// helpers
  const createVideoStream = async () => {
    return await axios
      .post(
        '/api/stream',
        {
          name: 'videocall',
          profiles: [
            {
              name: '720p',
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720,
            },
            {
              name: '480p',
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480,
            },
            {
              name: '360p',
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360,
            },
          ],
        },
        {
          headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setStreamKey(res.data.streamKey);
        return {
          playbackId: res.data.playbackId,
        };
      });
  };

  ///// APIs
  // called by VideoScreen
  const initVideocall = useCallback(async () => {
    // CREATE stream and get playback_id
    setPeer('');
    console.log('init video call');
    const { playbackId } = await createVideoStream();
    // SEND
    const payload = {
      type: 'init',
      playbackIdA: playbackId,
    };
    const encodedMsg = encodeMessage('videoCall', payload);
    console.log('test sendMessage: ', sendMessage);
    await sendMessage(encodedMsg);
  }, [createVideoStream, sendMessage]);

  // called by MessageRenderer
  const joinVideocallB = useCallback(async () => {
    // CREATE a video stream
    const { playbackId } = await createVideoStream();

    // SEND back (emit)
    const payload = {
      type: 'joinB',
      playbackIdB: playbackId,
    };
    const encodedMsg = encodeMessage('videoCall', payload);
    await sendMessage(encodedMsg);
  }, [setPeer, createVideoStream, sendMessage]);

  // called by VideoScreen
  const joinVideocallA = useCallback(
    async (peerPlaybackId: string) => {
      // SET peer video frame
      setPeer(peerPlaybackId);
    },
    [setPeer]
  );

  // called by VideoScreen
  const terminateVideocall = useCallback(() => {
    // STOP the stream
    console.log('peer', peer);

    // // SEND back message to alert terminating
    // const payload = {
    //     type: "terminate",
    // };
    // const encodedMsg = encodeMessage('videoCall', payload);
    // await sendMessage(encodedMsg);

    // CLEAN UP UI and states
    setVideoCalling('');
    setPeer('');
    setStreamKey('');
  }, [setVideoCalling, setPeer, setStreamKey]);

  useEffect(() => {
    console.log('test peer', peer);
  }, [peer]);

  const providerState = useMemo(
    () => ({
      videoCalling,
      setVideoCalling,
      peer,
      setPeer,
      streamKey,
      setStreamKey,
      initVideocall,
      joinVideocallB,
      joinVideocallA,
      terminateVideocall,
    }),
    [
      videoCalling,
      setVideoCalling,
      peer,
      setPeer,
      streamKey,
      setStreamKey,
      initVideocall,
      joinVideocallB,
      joinVideocallA,
      terminateVideocall,
    ]
  );

  return (
    <VideoCallContext.Provider value={providerState}>
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
