import { Button } from '@blueprintjs/core';
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

interface Props {
  canEdit: boolean;
  usersCount: number;
}

export const Controls: FC<Props> = (props) => {
  const { canEdit, usersCount: listenersCount } = props;

  return (
    <React.Fragment>
      <ListenersStyled title="Listeners">
        <FontAwesomeIcon icon={faUser} />
        <CountTextStyled>{listenersCount} watching now</CountTextStyled>
      </ListenersStyled>
      {canEdit && (
        <Button minimal small>
          <SkipTextStyled>Skip</SkipTextStyled>
          <FontAwesomeIcon icon={faStepForward} />
        </Button>
      )}
    </React.Fragment>
  );
};
