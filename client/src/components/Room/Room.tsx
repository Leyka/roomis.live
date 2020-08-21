import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { PlayerEvent, PlaylistEvent, RoomEvent, UserEvent } from '@shared/events';
import { Playlist as PlaylistType } from '@shared/types';
import { kebabCase } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { Chat } from '../Chat/Chat';
import { Controls } from '../Player/Controls';
import { Player } from '../Player/Player';
import { Playlist } from '../Playlist/Playlist';
import { RoomLayout } from './Layout/RoomLayout';
import { RoomHeader } from './RoomHeader';

export const Room: FC = () => {
  const { roomStore, userStore, playlistStore } = useRootStore();
  const { roomName } = roomStore;
  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  const roomNameFromUrl = kebabCase(name);
  roomStore.roomName = roomNameFromUrl;

  useEffect(() => {
    document.title = `${roomNameFromUrl} | Room Is Live`;
    socket.emit(UserEvent.Join, { roomName: roomNameFromUrl });

    socket.on(RoomEvent.Update, (room) => roomStore.set(room));

    socket.on(UserEvent.Update, (user) => userStore.set(user));

    socket.on(PlaylistEvent.Update, (playlist: PlaylistType) => {
      // If we have only one song in playlist, play it now
      const videos = Object.values(playlist.videos);
      if (videos.length === 0) {
        roomStore.videoToPlay = undefined;
      } else if (videos.length === 1) {
        roomStore.videoToPlay = videos[0];
        socket.emit(PlayerEvent.PrepareToPlay, { roomName });
      }
    });

    return () => {
      socket.off(UserEvent.Disconnect);
    };
    // eslint-disable-next-line
  }, []);

  const onGuestsCanEditClick = () => {
    socket.emit(RoomEvent.GuestsCanEdit, { canEdit: !roomStore.guestsCanEdit });
  };

  const onSkipVideoClick = () => {
    if (!roomStore.videoToPlay || playlistStore.videosSize <= 1) return;
    socket.emit(PlaylistEvent.SkipVideo, { roomName, videoId: roomStore.videoToPlay.id });
  };

  return useObserver(() => {
    return (
      <RoomLayout
        header={
          <RoomHeader
            roomName={roomName}
            isHost={userStore.isHost}
            canEdit={userStore.canEdit}
            userName={userStore.name}
            userColor={userStore.color}
          />
        }
        playlist={<Playlist />}
        player={
          <Player
            videoUrl={roomStore.videoToPlay?.url}
            roomName={roomName}
            canEdit={userStore.canEdit}
            isHost={userStore.isHost}
            guestsCanEdit={roomStore.guestsCanEdit}
            onGuestsCanEditClick={onGuestsCanEditClick}
          />
        }
        controls={
          <Controls
            hidden={!roomStore.hasVideo}
            isHost={userStore.isHost}
            canEdit={userStore.canEdit}
            usersCount={roomStore.usersCount}
            guestsCanEdit={roomStore.guestsCanEdit}
            onGuestsCanEditClick={onGuestsCanEditClick}
            skipDisabled={playlistStore.videosSize <= 1}
            onSkipClick={onSkipVideoClick}
          />
        }
        chat={<Chat />}
      />
    );
  });
};
