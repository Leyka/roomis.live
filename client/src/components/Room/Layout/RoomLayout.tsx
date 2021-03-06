import React, { FC, ReactElement } from 'react';
import './RoomLayout.scss';

interface Props {
  header: ReactElement;
  playlist: ReactElement;
  player: ReactElement;
  controls: ReactElement;
  chat: ReactElement;
}

export const RoomLayout: FC<Props> = (props) => {
  const { header, playlist, player, chat, controls } = props;
  return (
    <div className="room">
      <div className="room__header">{header}</div>
      <div className="room__main">
        <div className="room__player">{player}</div>
        <div className="room__controls">{controls}</div>
      </div>
      <div className="room__playlist">{playlist}</div>
      <div className="room__chat">{chat}</div>
    </div>
  );
};
