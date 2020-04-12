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
  color: #d42020;
  font-size: 14px;
`;

const CountTextStyled = styled.span`
  margin-left: 5px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSwitch = styled(Switch)`
  margin-bottom: 0;
  padding-right: 10px;
  border-right: 1px solid #b9b9b9;
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
      <ListenersStyled title="Listeners">
        <FontAwesomeIcon icon={faUser} />
        <CountTextStyled>{usersCount} watching now</CountTextStyled>
      </ListenersStyled>
      <ControlsContainer>
        {isHost && (
          <StyledSwitch
            checked={guestsCanEdit}
            label="Guests can edit"
            onChange={onGuestsCanEditClick}
          />
        )}
        {canEdit && (
          <Button minimal small>
            <SkipTextStyled>Skip</SkipTextStyled>
            <FontAwesomeIcon icon={faStepForward} />
          </Button>
        )}
      </ControlsContainer>
    </React.Fragment>
  );
};
