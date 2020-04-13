import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { PlaylistEvent, RoomEvent, UserEvent } from '@shared/events';
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
  const { roomStore, userStore } = useRootStore();
  const { roomName } = roomStore;
  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  roomStore.roomName = kebabCase(name);

  useEffect(() => {
    socket.emit(UserEvent.Join, { roomName: roomName });

    socket.on(RoomEvent.Update, (room) => roomStore.set(room));

    socket.on(UserEvent.Update, (user) => userStore.set(user));

    socket.on(PlaylistEvent.Update, (playlist: PlaylistType) => {
      // If we have only one song in playlist, play it now
      const videos = Object.values(playlist.videos);
      if (videos.length === 1) {
        roomStore.videoToPlay = videos[0];
        roomStore.videoIsPlaying = true;
      }
    });

    return () => {
      socket.off(UserEvent.Disconnect);
    };
  }, [roomName, userStore, roomStore]);

  const onGuestsCanEditClick = () => {
    socket.emit(RoomEvent.GuestsCanEdit, { canEdit: !roomStore.guestsCanEdit });
  };

  const onPlay = () => {
    roomStore.videoIsPlaying = true;
  };

  const onPause = () => {
    roomStore.videoIsPlaying = false;
  };

  const onInit = (playing: boolean) => {
    roomStore.videoIsPlaying = playing;
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
        playlist={<Playlist roomName={roomName} canEdit={userStore.canEdit} />}
        player={
          <Player
            videoUrl={roomStore.videoToPlay?.url}
            roomName={roomName}
            canEdit={userStore.canEdit}
            isHost={userStore.isHost}
            guestsCanEdit={roomStore.guestsCanEdit}
            onGuestsCanEditClick={onGuestsCanEditClick}
            playing={roomStore.videoIsPlaying}
            onInit={onInit}
            onPlay={onPlay}
            onPause={onPause}
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
          />
        }
        chat={<Chat />}
      />
    );
  });
};
