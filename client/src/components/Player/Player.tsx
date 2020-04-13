import { socket } from '@/utils/socket';
import { PlayerEvent } from '@shared/events';
import { Player as PlayerType } from '@shared/types';
import React, { FC, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { EmptyPlayer } from './Empty';

interface Props {
  roomName: string;
  canEdit: boolean;
  isHost: boolean;
  videoUrl?: string;
  playing: boolean;
  onInit(playing: boolean): void;
  onPlay(): void;
  onPause(): void;
  guestsCanEdit: boolean;
  onGuestsCanEditClick(): void;
}

export const Player: FC<Props> = (props) => {
  const {
    roomName,
    canEdit,
    isHost,
    videoUrl,
    guestsCanEdit,
    onGuestsCanEditClick,
    playing,
    onInit,
    onPlay,
    onPause,
  } = props;

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    socket.on(PlayerEvent.Init, (playerState: PlayerType) => {
      if (playerState.playedSeconds !== 0) {
        playerRef.current?.seekTo(playerState.playedSeconds);
      }
      onInit(playerState.isPlaying);
    });

    socket.on(PlayerEvent.Play, ({ playedSeconds }) => {
      onPlay();
      const currentTime = playerRef.current!.getCurrentTime();
      const synced = Math.round(currentTime) === Math.round(playedSeconds);
      if (!synced) {
        playerRef.current!.seekTo(playedSeconds);
      }
    });

    socket.on(PlayerEvent.Pause, onPause);
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
    canEdit && socket.emit(PlayerEvent.Progress, { roomName, playedSeconds }); // TODO: Only host can send his progress time to server
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
