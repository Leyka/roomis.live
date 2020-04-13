import { Classes, Dialog } from '@blueprintjs/core';
import React, { FC } from 'react';
import styled from 'styled-components';
import { AddVideo, AddVideoProps } from './AddVideo';

const DialogStyled = styled(Dialog)`
  max-width: 400px;
`;

interface Props extends AddVideoProps {
  isOpen: boolean;
}

export const AddVideoDialog: FC<Props> = (props) => {
  const { isOpen } = props;
  return (
    <DialogStyled isOpen={isOpen}>
      <div className={Classes.DIALOG_HEADER}>
        <h5 className={Classes.HEADING}>Add Video to Playlist</h5>
      </div>
      <div className={Classes.DIALOG_BODY}>
        <AddVideo {...props} />
      </div>
    </DialogStyled>
  );
};
