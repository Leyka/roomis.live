import { useRootStore } from '@/store';
import { PlayerEvent } from '@shared/events';
import { Player } from '@shared/types';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface Props {
  socket: SocketIOClient.Socket;
}

export const LivePlayer: FC<Props> = (props) => {
  const { roomStore, livePlayerStore } = useRootStore();
  const { roomName } = roomStore;
  const { socket } = props;
  const playerRef = useRef<ReactPlayer>(null);

  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  const [seekAsked, setSeekAsked] = useState(false);
  const [desiredSeekTime, setDesiredSeekTime] = useState(0);
  const [startLoadingTime, setStartLoadingTime] = useState(0);

  useEffect(() => {
    const catchUpLoadingTime = () => {
      // const currentTime = playerRef.current!.getCurrentTime();
      const loadingTime = (new Date().getTime() - startLoadingTime) / 1000;
      console.log('Catching up...', { desiredSeekTime, loadingTime });
      playerRef.current?.seekTo(desiredSeekTime + loadingTime);
      setSeekAsked(false);
    };
    socket.on(PlayerEvent.Init, (playerState: Player) => {
      if (playerState.playedSeconds !== 0) {
        setDesiredSeekTime(playerState.playedSeconds);
        setSeekAsked(true);
        setStartLoadingTime(new Date().getTime());
      }
      setPlaying(playerState.isPlaying);
    });

    if (seekAsked && !loading) {
      catchUpLoadingTime();
      setPlaying(true);
    }

    socket.on(PlayerEvent.Play, ({ playedSeconds }) => {
      // Check if we need to sync the player
      const currentTime = playerRef.current!.getCurrentTime();
      console.log('Play asked');
      console.log({ playedSeconds, currentTime });
      if (Math.round(currentTime) !== Math.round(playedSeconds)) {
        setDesiredSeekTime(playedSeconds);
        setSeekAsked(true);
        setStartLoadingTime(new Date().getTime());
        setPlaying(false);
      }

      setPlaying(true);
    });

    socket.on(PlayerEvent.Pause, () => setPlaying(false));
  }, [socket, playing, loading, seekAsked, startLoadingTime, desiredSeekTime]);

  const onReady = () => {
    socket.emit(PlayerEvent.Ready, { roomName });
  };

  const onPlay = () => {
    socket.emit(PlayerEvent.Play, { roomName });
  };

  const onPause = () => {
    socket.emit(PlayerEvent.Pause, { roomName });
  };

  const onProgress = ({ playedSeconds }) => {
    livePlayerStore.playedSeconds = playedSeconds;
    socket.emit(PlayerEvent.Progress, { roomName, playedSeconds }); // TODO: Only host can send his progress time to server
  };

  return useObserver(() => {
    return (
      <ReactPlayer
        ref={playerRef}
        url={livePlayerStore.videoUrl}
        width="100%"
        height="100%"
        controls
        playing={playing}
        onReady={onReady}
        onBuffer={() => setLoading(true)}
        onBufferEnd={() => setLoading(false)}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
      />
    );
  });
};
