import { Alignment, Classes, Navbar, Position, Tag, Toaster } from '@blueprintjs/core';
import { faCopy, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styled from 'styled-components';
import { copyToClipboard } from '@/utils/clipboard';

const HeadingStyled = styled(Navbar.Heading)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const UserIconStyled = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
`;

const CopyIconStyled = styled(FontAwesomeIcon)`
  color: #808080;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const RoleTagStyled = styled(Tag)`
  line-height: normal;
  margin-top: 2px;
`;

interface Props {
  roomName: string;
  userName: string;
  userColor: string;
  isHost: boolean;
  canEdit: boolean;
}

const Toast = Toaster.create({
  position: Position.TOP,
  maxToasts: 1,
});

export const RoomHeader: FC<Props> = (props) => {
  const { roomName, userName, userColor, isHost, canEdit } = props;

  const onCopyIconClick = () => {
    copyToClipboard(window.location.href);

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
          <HeadingStyled className="serif">
            #{roomName}
            <CopyIconStyled
              icon={faCopy}
              onClick={onCopyIconClick}
              title="Click to copy room link and share it with friends"
            />
          </HeadingStyled>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <HeadingStyled className="serif" style={{ color: `#${userColor}` }}>
            <UserIconStyled icon={faUserCircle} /> {userName}
          </HeadingStyled>
          {isHost && (
            <RoleTagStyled className={Classes.INTENT_DANGER} round>
              Host
            </RoleTagStyled>
          )}
          {!isHost && canEdit && (
            <RoleTagStyled className={Classes.INTENT_PRIMARY} round>
              Super Guest
            </RoleTagStyled>
          )}
          {!isHost && !canEdit && <RoleTagStyled round>Guest</RoleTagStyled>}
        </Navbar.Group>
      </Navbar>
    </React.Fragment>
  );
};
