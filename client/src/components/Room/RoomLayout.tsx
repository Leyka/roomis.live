import React, { FC, ReactElement } from 'react';
import './Room.scss';

interface Props {
  header: ReactElement;
  playlist: ReactElement;
  player: ReactElement;
  logger: ReactElement;
  chat: ReactElement;
}

export const RoomLayout: FC<Props> = (props) => {
  const { header, playlist, player, logger, chat } = props;
  return (
    <div className="room">
      <div className="room__header">{header}</div>
      <div className="room__main">
        <div className="room__player">{player}</div>
        <div className="room__logger">{logger}</div>
      </div>
      <div className="room__playlist">{playlist}</div>
      <div className="room__chat">{chat}</div>
    </div>
  );
};
