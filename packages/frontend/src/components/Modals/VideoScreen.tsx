import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Button, Icon, IconButton } from '@chakra-ui/react';
import { useVideoCall } from '@hooks/useVideoCall';
import { CastSession, Client } from '@livepeer/webrtmp-sdk';
import { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { BsCameraVideo } from 'react-icons/bs'

export const VideoScreen = () => {
  const [videoEl, setVideoEl] = useState<any>();
  const [url, setUrl] = useState('');
  const stream = useRef<MediaStream>();
  const session = useRef<CastSession>();
  const client = new Client();
  const videoCall = useVideoCall();

  const handleOnClick = async () => {
    videoCall.setVideoCalling('A');
  };

  const initRenderVideo = async () => {
    videoEl.volume = 0;
    stream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoEl.srcObject = stream.current;
    videoEl.play();

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
      console.log(videoEl);
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
      <IconButton aria-label="Toggle theme"
        variant="outline"
        border="none"
        icon={<Icon as={BsCameraVideo} />}
        onClick={handleOnClick} />
      <Modal isOpen={!!videoCall.videoCalling} onClose={() => { }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <video ref={setVideoEl} />
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
                setVideoEl(undefined);
                stream.current = undefined;
              }}
            >
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
