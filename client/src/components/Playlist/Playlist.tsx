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
import { AddVideoDialog } from './AddVideoDialog';
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

const SmallTextPlaylistStyled = styled.small`
  color: #a9a9a9;
  margin-bottom: 5px;
`;

export const Playlist: FC = () => {
  // Global state
  const { playlistStore, roomStore, userStore } = useRootStore();
  const { roomName } = roomStore;
  const { canEdit } = userStore;
  // Local state
  const [isOpenDiv, setIsOpenDiv] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isValidYoutubeUrl, setIsValidYoutubeUrl] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    socket.on(PlaylistEvent.Update, (playlist) => playlistStore.set(playlist));
  }, [playlistStore]);

  useEffect(() => {
    const updateIsMediumScreen = () => {
      setIsMediumScreen(window.innerWidth >= 768 && window.innerWidth < 1200);
    };

    updateIsMediumScreen();

    window.addEventListener('resize', updateIsMediumScreen);
    return () => {
      window.removeEventListener('resize', updateIsMediumScreen);
    };
  }, []);

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
    resetState();
  };

  const onCancelClick = () => {
    resetState();
  };

  const resetState = () => {
    setIsOpenDialog(false);
    setIsOpenDiv(false);
    setIsValidYoutubeUrl(false);
  };

  const onDeleteVideoClick = (videoId: string) => {
    socket.emit(PlaylistEvent.DeleteVideo, { roomName, videoId });
  };

  const onOpenAddButton = () => {
    isMediumScreen ? setIsOpenDialog(true) : setIsOpenDiv(true);
  };

  return useObserver(() => (
    <div>
      <PlaylistHeader style={{ flexDirection: isMediumScreen ? 'column' : 'row' }}>
        {isMediumScreen && <SmallTextPlaylistStyled>PLAYLIST</SmallTextPlaylistStyled>}
        {!isMediumScreen && <H4Styled>Playlist</H4Styled>}
        {canEdit && (
          <Button minimal onClick={onOpenAddButton} title="Add new video to playlist">
            <AddIconStyled icon={faPlusCircle} color="#8ac797" />
          </Button>
        )}
      </PlaylistHeader>
      <Divider />
      <ContainerStyled>
        {canEdit && (
          <React.Fragment>
            <AddVideoDialog
              isOpen={isOpenDialog}
              isYoutubeUrl={isValidYoutubeUrl}
              validateUrl={validateUrl}
              onAddClick={onAddVideoClick}
              onCancelClick={onCancelClick}
            />
            <AddVideo
              hidden={isMediumScreen || !isOpenDiv}
              isYoutubeUrl={isValidYoutubeUrl}
              validateUrl={validateUrl}
              onAddClick={onAddVideoClick}
              onCancelClick={onCancelClick}
            />
          </React.Fragment>
        )}
        <Videos
          videos={Object.values(playlistStore.videos)}
          onDeleteVideoClick={onDeleteVideoClick}
          videoPlayingId={roomStore.videoToPlay?.id}
          isMediumScreen={isMediumScreen}
          canEdit={canEdit}
        />
      </ContainerStyled>
    </div>
  ));
};
