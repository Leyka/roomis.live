import { useRootStore } from '@/store';
import { useObserver } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useParams } from 'react-router';
import { RoomLayout } from './RoomLayout';

export const Room: FC = () => {
  const { roomStore } = useRootStore();

  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  roomStore.name = escape(name!);

  return useObserver(() => (
    <RoomLayout
      header={<div>Room: {roomStore.name}</div>}
      playlist={<div>Playlist</div>}
      player={<div>Player</div>}
      logger={<div>Logger</div>}
      chat={<div>Chat</div>}
    />
  ));
};
