import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { RoomEvent } from '@shared/events';
import { kebabCase } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { Chat } from '../Chat/Chat';
import { LivePlayer } from '../LivePlayer/LivePlayer';
import { RoomLayout } from './Layout/RoomLayout';
import { RoomHeader } from './RoomHeader';

export const Room: FC = () => {
  const { roomStore, userStore } = useRootStore();
  const { roomName } = roomStore;
  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  roomStore.roomName = kebabCase(name);

  useEffect(() => {
    socket.emit(RoomEvent.UserJoin, { roomName: roomName });
    socket.on(RoomEvent.UserUpdate, (user) => userStore.set(user));

    return () => {
      socket.off(RoomEvent.UserDisconnect);
    };
  }, [roomName, userStore]);

  return useObserver(() => {
    if (!socket) {
      return <div>Loading...</div>;
    }

    return (
      <RoomLayout
        header={
          <RoomHeader
            roomName={roomName}
            isHost={userStore.isHost}
            userName={userStore.name}
            userColor={userStore.color}
          />
        }
        playlist={<div>Playlist</div>}
        player={<LivePlayer roomName={roomName} userCanEdit userIsHost />}
        chat={<Chat />}
      />
    );
  });
};
