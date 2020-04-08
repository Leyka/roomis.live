import { SERVER_URL } from '@/config';
import { useRootStore } from '@/store';
import { RoomEvent } from '@shared/events';
import { kebabCase } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ioClient from 'socket.io-client';
import { RoomLayout } from './RoomLayout';

export const Room: FC = () => {
  const { roomStore } = useRootStore();
  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  roomStore.name = kebabCase(name);

  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const initSocket = async () => {
      const socket = await ioClient(SERVER_URL);
      setSocket(socket);
      // Notify server that a user joined a room
      socket.emit(RoomEvent.UserJoin, { roomName: roomStore.name });
    };

    initSocket();
  }, [roomStore.name]);

  return useObserver(() => {
    if (!socket) {
      return <div>Loading...</div>;
    }

    return (
      <RoomLayout
        header={<div>Room: {roomStore.name}</div>}
        playlist={<div>Playlist</div>}
        player={<div>Player</div>}
        logger={<div>Logger</div>}
        chat={<div>Chat</div>}
      />
    );
  });
};
