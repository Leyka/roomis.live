import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { RoomEvent } from '@shared/events';
import { kebabCase } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { LivePlayer } from '../LivePlayer/LivePlayer';
import { Logger } from '../Logger/Logger';
import { RoomLayout } from './RoomLayout';

export const Room: FC = () => {
  const [canEdit, setCanEdit] = useState(false); // TODO: Delete
  const { roomStore, userStore } = useRootStore();

  // Returns name of the room that users entered in URL bar
  const { name } = useParams();
  roomStore.roomName = kebabCase(name);

  useEffect(() => {
    socket.emit(RoomEvent.UserJoin, { roomName: roomStore.roomName });
    socket.on(RoomEvent.UserUpdate, (user) => userStore.set(user));

    return () => {
      socket.off(RoomEvent.UserDisconnect);
    };
  }, []);

  const onGuestsCanEditClick = () => {
    setCanEdit(!canEdit);
    socket!.emit(RoomEvent.GuestsCanEdit, { canEdit: !canEdit });
  };

  return useObserver(() => {
    if (!socket) {
      return <div>Loading...</div>;
    }

    return (
      <RoomLayout
        header={
          <div>
            Room: {roomStore.roomName}
            <div>
              Test only: <button onClick={onGuestsCanEditClick}>Toggle guest right</button>
            </div>
            <div>Can Edit ? {userStore.canEdit ? 'Yes' : 'No'}</div>
          </div>
        }
        playlist={<div>Playlist</div>}
        player={<LivePlayer roomName={roomStore.roomName} userCanEdit userIsHost />}
        logger={<Logger />}
        chat={<div>Chat</div>}
      />
    );
  });
};
