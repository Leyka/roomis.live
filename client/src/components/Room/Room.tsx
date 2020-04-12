import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { RoomEvent, UserEvent } from '@shared/events';
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

    socket.on(UserEvent.Update, (user) => userStore.set(user));

    socket.on(RoomEvent.Update, (room) => roomStore.set(room));

    return () => {
      socket.off(UserEvent.Disconnect);
    };
  }, [roomName, userStore, roomStore]);

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
        playlist={<Playlist canEdit={userStore.canEdit} />}
        player={<Player roomName={roomName} userCanEdit userIsHost />}
        controls={<Controls canEdit={userStore.canEdit} usersCount={roomStore.usersCount} />}
        chat={<Chat />}
      />
    );
  });
};
