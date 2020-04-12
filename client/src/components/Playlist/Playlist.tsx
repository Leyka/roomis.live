import { Button, Divider, H4 } from '@blueprintjs/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const H4Styled = styled(H4)`
  margin: 0;
`;

const AddIconStyled = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
`;

const ContainerStyled = styled.div`
  margin-top: 15px;
`;

interface Props {
  canEdit: boolean;
}

export const Playlist: FC<Props> = (props) => {
  const [addClicked, setAddClicked] = useState(false);
  const { canEdit } = props;

  return (
    <div>
      <PlaylistHeader>
        <H4Styled>Playlist</H4Styled>
        {canEdit && (
          <Button minimal title="Add new video to playlist" onClick={() => setAddClicked(true)}>
            <AddIconStyled icon={faPlusCircle} />
          </Button>
        )}
      </PlaylistHeader>
      <Divider />
      <ContainerStyled>Container</ContainerStyled>
    </div>
  );
};
