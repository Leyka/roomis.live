import { Button, Switch } from '@blueprintjs/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styled from 'styled-components';

const ContainerStyled = styled.div`
  height: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-left: 1px solid #d3d4d4;
  border-right: 1px solid #d3d4d4;
`;

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
  hidden: boolean;
  canEdit: boolean;
  isHost: boolean;
  guestsCanEdit: boolean;
  onGuestsCanEditClick(): void;
  usersCount: number;
  skipDisabled: boolean;
  onSkipClick(): void;
}

export const Controls: FC<Props> = (props) => {
  const {
    hidden,
    isHost,
    canEdit,
    usersCount,
    guestsCanEdit,
    onGuestsCanEditClick,
    skipDisabled,
    onSkipClick,
  } = props;

  return (
    <ContainerStyled style={{ display: hidden ? 'none' : 'flex' }}>
      <ListenersStyled
        title="watching now"
        style={{ color: usersCount > 1 ? '#f44336' : '#505050' }}
      >
        <FontAwesomeIcon icon={faUser} />
        <CountTextStyled>{usersCount}</CountTextStyled>
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
          <ButtonSkipStyled minimal small disabled={skipDisabled} onClick={onSkipClick}>
            <SkipTextStyled>Skip</SkipTextStyled>
            <FontAwesomeIcon icon={faStepForward} />
          </ButtonSkipStyled>
        )}
      </ControlsContainer>
    </ContainerStyled>
  );
};
