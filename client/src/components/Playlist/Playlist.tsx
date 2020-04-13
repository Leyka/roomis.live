import { useRootStore } from '@/store';
import { socket } from '@/utils/socket';
import { isValidYouTubeUrl } from '@/utils/validator';
import { Button, Divider, H4 } from '@blueprintjs/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlaylistEvent } from '@shared/events';
import { Source } from '@shared/types';
import { useObserver } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddVideo } from './AddVideo';
import { Videos } from './Videos';

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const H4Styled = styled(H4)`
  margin: 0;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const AddIconStyled = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
`;

const ContainerStyled = styled.div`
  margin-top: 15px;
`;

interface Props {
  roomName: string;
  canEdit: boolean;
}

export const Playlist: FC<Props> = (props) => {
  const { playlistStore, roomStore } = useRootStore();
  const [addClicked, setAddClicked] = useState(false);
  const [isValidYoutubeUrl, setIsValidYoutubeUrl] = useState(false);
  const { canEdit, roomName } = props;

  useEffect(() => {
    socket.on(PlaylistEvent.Update, (playlist) => playlistStore.set(playlist));
  }, [playlistStore]);

  const validateUrl = (url: string) => {
    const isValidYouTube = isValidYouTubeUrl(url);
    setIsValidYoutubeUrl(isValidYouTube);
  };

  const onAddVideoClick = (videoUrl: string) => {
    const isValid = isValidYouTubeUrl;
    if (!isValid) return;

    // In future, we will support SoundCloud and other providers
    let source;
    if (isValidYoutubeUrl) {
      source = Source.Youtube;
    }

    socket.emit(PlaylistEvent.NewVideo, { roomName, source, videoUrl });
    setAddClicked(false);
    setIsValidYoutubeUrl(false);
  };

  const onCancelClick = () => {
    setAddClicked(false);
    setIsValidYoutubeUrl(false);
  };

  const onDeleteVideoClick = (videoId: string) => {
    socket.emit(PlaylistEvent.DeleteVideo, { roomName, videoId });
  };

  return useObserver(() => (
    <div>
      <PlaylistHeader>
        <H4Styled>Playlist </H4Styled>
        {canEdit && (
          <Button minimal title="Add new video to playlist" onClick={() => setAddClicked(true)}>
            <AddIconStyled icon={faPlusCircle} />
          </Button>
        )}
      </PlaylistHeader>
      <Divider />
      <ContainerStyled>
        <AddVideo
          hidden={!canEdit || !addClicked}
          isYoutubeUrl={isValidYoutubeUrl}
          validateUrl={validateUrl}
          onAddClick={onAddVideoClick}
          onCancelClick={onCancelClick}
        />
        <Videos
          videos={Object.values(playlistStore.videos)}
          onDeleteVideoClick={onDeleteVideoClick}
          videoPlayingId={roomStore.videoToPlay?.id}
        />
      </ContainerStyled>
    </div>
  ));
};
