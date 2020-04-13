import { NonIdealState, Switch } from '@blueprintjs/core';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const NonIdealStateStyled = styled(NonIdealState)`
  h4,
  p {
    font-size: 1.2rem;
  }
`;

interface Props {
  isHost: boolean;
  canEdit: boolean;
  guestsCanEdit: boolean;
  onGuestsCanEditClick(): void;
}

export const EmptyPlayer: FC<Props> = (props) => {
  const [message, setMessage] = useState('');
  const { isHost, canEdit, onGuestsCanEditClick, guestsCanEdit } = props;

  useEffect(() => {
    const adaptMessage = () => {
      if (isHost) {
        setMessage('Start by adding videos to the playlist or let your guests do so.');
      } else if (canEdit) {
        setMessage('Start by adding some videos to the playlist.');
      } else {
        setMessage('Wait for the host to add videos to the playlist.');
      }
    };
    adaptMessage();

    return () => {
      setMessage('');
    };
  }, [isHost, canEdit]);

  return (
    <NonIdealStateStyled
      className="sans-serif"
      title="Looks like it's empty"
      icon="video"
      description={<p>{message}</p>}
      action={
        <EmptyPlayerAction
          isHost={isHost}
          guestsCanEdit={guestsCanEdit}
          onGuestsCanEditClick={onGuestsCanEditClick}
        />
      }
    />
  );
};

const EmptyPlayerAction: FC<Partial<Props>> = (props) => {
  const { isHost, guestsCanEdit, onGuestsCanEditClick } = props;
  if (isHost) {
    return (
      <Switch checked={guestsCanEdit} label="Guests can edit" onChange={onGuestsCanEditClick} />
    );
  }
  return null;
};
