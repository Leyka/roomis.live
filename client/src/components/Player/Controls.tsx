import { Button, Switch } from '@blueprintjs/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styled from 'styled-components';

const SkipTextStyled = styled.span`
  margin-right: 5px;
`;

const ListenersStyled = styled.div`
  font-size: 14px;
`;

const CountTextStyled = styled.span`
  margin-left: 5px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GuestsSwitchStyled = styled(Switch)`
  margin-bottom: 0;
  padding-right: 10px;
`;
const ButtonSkipStyled = styled(Button)`
  padding-left: 10px;
  border-left: 1px solid #b9b9b9;
`;

interface Props {
  canEdit: boolean;
  isHost: boolean;
  guestsCanEdit: boolean;
  onGuestsCanEditClick(): void;
  usersCount: number;
}

export const Controls: FC<Props> = (props) => {
  const { isHost, canEdit, usersCount, guestsCanEdit, onGuestsCanEditClick } = props;

  return (
    <React.Fragment>
      <ListenersStyled title="Listeners" style={{ color: usersCount > 1 ? '#f44336' : '#505050' }}>
        <FontAwesomeIcon icon={faUser} />
        <CountTextStyled>{usersCount} watching now</CountTextStyled>
      </ListenersStyled>
      <ControlsContainer>
        {isHost && (
          <GuestsSwitchStyled
            checked={guestsCanEdit}
            label="Guests can edit"
            onChange={onGuestsCanEditClick}
          />
        )}
        {canEdit && (
          <ButtonSkipStyled minimal small>
            <SkipTextStyled>Skip</SkipTextStyled>
            <FontAwesomeIcon icon={faStepForward} />
          </ButtonSkipStyled>
        )}
      </ControlsContainer>
    </React.Fragment>
  );
};
