import { Card, Elevation } from '@blueprintjs/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Video } from '@shared/types';
import React, { FC } from 'react';
import styled from 'styled-components';

const ContainerStyled = styled.div`
  margin-top: 20px;
  max-height: 800px;
  overflow-y: auto;
`;

interface VideosProps {
  videos: Video[];
}

export const Videos: FC<VideosProps> = (props) => {
  const { videos } = props;
  const empty = videos.length === 0;
  return (
    <ContainerStyled>
      {empty && <p>No videos yet.</p>}
      {!empty && (
        <div>
          {videos.map((video) => (
            <VideoCard video={video} key={video.id} />
          ))}
        </div>
      )}
    </ContainerStyled>
  );
};

interface VideoCardProps {
  video: Video;
}

const VideoCardStyled = styled(Card)`
  margin-bottom: 10px;
  padding: 10px;

  p {
    margin: 0;
  }
`;

const TwoColumnsStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ThumbnailStyled = styled.img`
  width: 90px;
  margin-right: 5px;
`;

const ChannelTitleStyled = styled.p`
  font-size: 0.75rem;
  color: #616161;
  padding-top: 2px;
`;

const CardFooterStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 1.1rem;
  color: #5c7080;
`;

export const VideoCard: FC<VideoCardProps> = (props) => {
  const { video } = props;
  return (
    <VideoCardStyled interactive elevation={Elevation.ONE}>
      <TwoColumnsStyled>
        <div>
          <ThumbnailStyled src={video.thumbnail} width="80" />
        </div>
        <div>
          <span>{video.title}</span>
          <ChannelTitleStyled>{video.channel}</ChannelTitleStyled>
        </div>
      </TwoColumnsStyled>
      <CardFooterStyled>
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={() => console.log('Deleting')}
          title={`Delete ${video.title}`}
        />
      </CardFooterStyled>
    </VideoCardStyled>
  );
};
