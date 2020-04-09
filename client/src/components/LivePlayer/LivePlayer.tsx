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
  const { roomStore } = useRootStore();
  const { roomName } = roomStore;
  const { socket } = props;

  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    socket.on(PlayerEvent.Init, (playerState: Player) => {
      if (playerState.playedSeconds !== 0) {
        playerRef.current?.seekTo(playerState.playedSeconds);
      }
      setPlaying(playerState.isPlaying);
    });

    socket.on(PlayerEvent.Play, ({ playedSeconds }) => {
      setPlaying(true);
      const currentTime = playerRef.current!.getCurrentTime();
      const synced = Math.round(currentTime) === Math.round(playedSeconds);
      if (!synced) {
        playerRef.current!.seekTo(playedSeconds);
      }
    });

    socket.on(PlayerEvent.Pause, () => setPlaying(false));
  }, [socket, playing]);

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
    socket.emit(PlayerEvent.Progress, { roomName, playedSeconds }); // TODO: Only host can send his progress time to server
  };

  return useObserver(() => {
    return (
      <ReactPlayer
        ref={playerRef}
        url="https://www.youtube.com/watch?v=yZwmsfyjGuM&t=1s" // TODO: Retrieve from playlist
        width="100%"
        height="100%"
        controls
        playing={playing}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
      />
    );
  });
};
