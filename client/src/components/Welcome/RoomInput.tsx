import React, { useState, FC } from 'react';
import styled from 'styled-components';
import { InputGroup, Tag, Tooltip, Button } from '@blueprintjs/core';

interface Props {
  onJoinRoomClick(roomName: string): void;
}

const StyledInput = styled(InputGroup)`
  font-family: Arial, serif;
  width: 350px;
  justify-self: center;
  margin-top: 10px;
`;

export const RoomInput: FC<Props> = ({ onJoinRoomClick }) => {
  const [roomName, setRoomName] = useState('');

  const SiteNameTag = <Tag minimal>{window.location.href}</Tag>;

  const JoinRoomButton = (
    <Tooltip content={`Join room ${roomName}`} position="bottom">
      <Button
        icon="arrow-right"
        intent="primary"
        minimal
        onClick={() => onJoinRoomClick(roomName)}
        disabled={!roomName}
      />
    </Tooltip>
  );

  const onKeyPress = (e) => {
    if (e.which === 13 && roomName) {
      // Enter key
      e.preventDefault();
      onJoinRoomClick(roomName);
    }
  };

  return (
    <StyledInput
      placeholder="Your room name"
      leftElement={SiteNameTag}
      rightElement={JoinRoomButton}
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      onKeyPress={onKeyPress}
      round
      large
    />
  );
};
