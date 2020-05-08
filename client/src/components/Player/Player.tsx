import { socket } from '@/utils/socket';
import { PlayerEvent } from '@shared/events';
import { Player as PlayerType } from '@shared/types';
import React, { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { EmptyPlayer } from './Empty';

interface Props {
  roomName: string;
  canEdit: boolean;
  isHost: boolean;
  videoUrl?: string;
  guestsCanEdit: boolean;
  onGuestsCanEditClick(): void;
}

export const Player: FC<Props> = (props) => {
  const { roomName, canEdit, isHost, videoUrl, guestsCanEdit, onGuestsCanEditClick } = props;

  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    socket.on(PlayerEvent.Init, (player: PlayerType) => {
      if (player.playedSeconds !== 0) {
        playerRef.current?.seekTo(player.playedSeconds);
      }
      setPlaying(player.isPlaying);
    });

    socket.on(PlayerEvent.Play, ({ playedSeconds }) => {
      setPlaying(true);

      // Adjust player time
      const currentTime = playerRef.current!.getCurrentTime();
      const synced = Math.round(currentTime) === Math.round(playedSeconds);
      if (!synced) {
        playerRef.current!.seekTo(playedSeconds);
      }
    });

    socket.on(PlayerEvent.Pause, () => setPlaying(false));
  }, [playing]);

  const onReady = () => {
    socket.emit(PlayerEvent.Ready, { roomName });
  };

  const onPlayClick = () => {
    canEdit && socket.emit(PlayerEvent.Play, { roomName });
  };

  const onPauseClick = () => {
    canEdit && socket.emit(PlayerEvent.Pause, { roomName });
  };

  const onProgress = ({ playedSeconds }) => {
    // TODO: Store variable locally of played or maybe useRef
    isHost && socket.emit(PlayerEvent.Progress, { roomName, playedSeconds });
  };

  if (!videoUrl) {
    return (
      <EmptyPlayer
        isHost={isHost}
        canEdit={canEdit}
        onGuestsCanEditClick={onGuestsCanEditClick}
        guestsCanEdit={guestsCanEdit}
      />
    );
  }

  return (
    <ReactPlayer
      ref={playerRef}
      url={videoUrl}
      width="100%"
      height="100%"
      controls
      playing={playing}
      onReady={onReady}
      onPlay={onPlayClick}
      onPause={onPauseClick}
      onProgress={onProgress}
    />
  );
};
