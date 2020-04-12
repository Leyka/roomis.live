import { Alignment, Classes, Navbar, Position, Tag, Toaster } from '@blueprintjs/core';
import { faCopy, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styled from 'styled-components';

const HeadingStyled = styled(Navbar.Heading)`
  font-size: 1.25rem;
  font-weight: bold;
`;

const UserIconStyled = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
`;

const CopyIconStyled = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  color: #6d6d6d;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  roomName: string;
  userName: string;
  userColor: string;
  isHost: boolean;
}

const Toast = Toaster.create({
  position: Position.TOP,
  maxToasts: 1,
});

export const RoomHeader: FC<Props> = (props) => {
  const { roomName, userName, userColor, isHost } = props;

  const onCopyIconClick = () => {
    navigator.clipboard.writeText(window.location.href);
    Toast.show({
      message: 'Room link copied!',
      intent: 'success',
      icon: 'duplicate',
      timeout: 1500,
    });
  };

  return (
    <React.Fragment>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <HeadingStyled className="sans-serif">
            #{roomName}
            <CopyIconStyled
              icon={faCopy}
              onClick={onCopyIconClick}
              title="Click to copy room link and share it with friends"
            />
          </HeadingStyled>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <HeadingStyled className="sans-serif" style={{ color: `#${userColor}` }}>
            <UserIconStyled icon={faUserCircle} /> {userName}
          </HeadingStyled>
          {isHost && <Tag className={Classes.INTENT_DANGER}>Host</Tag>}
          {!isHost && <Tag>Guest</Tag>}
        </Navbar.Group>
      </Navbar>
    </React.Fragment>
  );
};
