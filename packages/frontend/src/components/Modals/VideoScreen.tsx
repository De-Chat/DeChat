import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useVideoCall } from '@hooks/useVideoCall';
import { CastSession, Client } from '@livepeer/webrtmp-sdk';
import { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';

export const VideoScreen = () => {
  // const videoEl = useRef(null);
  const [url, setUrl] = useState('');

  const stream = useRef<MediaStream>();
  const session = useRef<CastSession>();
  const videoEl = useRef<HTMLVideoElement>();
  const client = new Client();
  const videoCall = useVideoCall();

  const handleOnClick = async () => {
    videoCall.setVideoCalling('A');
  };

  const initRenderVideo = async () => {
    if (videoEl.current) {
      videoEl.current.volume = 0;
      videoEl.current.srcObject = stream.current || null;
      videoEl.current.play();
    }

    stream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoCall.videoCalling == 'A') {
      await videoCall.initVideocall();
    } else if (videoCall.videoCalling == 'B') {
      await videoCall.joinVideocallB();
    }
  };

  // set session when streamKey is ready
  useEffect(() => {
    if (videoCall.streamKey) {
      console.log('videocall streamkey', videoCall.streamKey);
      if (stream.current) {
        session.current = client.cast(stream.current, videoCall.streamKey);

        session.current.on('open', () => {
          alert('video call On');
        });

        session.current.on('close', () => {
          alert('video call off');
        });
      }
    }
  }, [videoCall.streamKey]);

  useAsyncEffect(async () => {
    console.log('trying to setup videoEl', videoEl, videoCall.videoCalling);
    if (videoEl) {
      await initRenderVideo();
    }
  }, [videoEl]);

  useEffect(() => {
    //console.log(`test livepeer url: https://lvpr.tv?v=${videoCall.peer}`)
    if (videoCall.peer) {
      setUrl(`https://lvpr.tv?v=${videoCall.peer}`);
      console.log(videoCall.peer);
    }
  }, [videoCall.peer]);

  useEffect(() => {
    console.log(url);
  }, [url]);
  return (
    <>
      <Button onClick={handleOnClick}>Open Modal</Button>
      <Modal isOpen={!!videoCall.videoCalling} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <video ref={videoEl as any} />
            {url ? (
              <iframe
                src={url}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                sandbox="allow-scripts"
              />
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (session.current) {
                  console.log('session current');
                  session.current.close();
                }
                videoCall.terminateVideocall();
                videoEl.current = undefined;
                stream.current = undefined;
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
