import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const InputTextStyled = styled(InputGroup)`
  margin-bottom: 10px;
`;

const MediaIconsStyled = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 5px;
`;

interface Props {
  hidden: boolean;
  isYoutubeUrl: boolean;
  validateUrl(url: string): void;
  onAddClick(url: string): void;
  onCancelClick(): void;
}

export const AddVideo: FC<Props> = (props) => {
  const [textUrlInput, setTextUrlInput] = useState('');
  const { hidden, isYoutubeUrl, onAddClick, validateUrl, onCancelClick } = props;

  useEffect(() => {
    return () => {
      setTextUrlInput('');
    };
  }, [hidden]);

  return (
    <div hidden={hidden}>
      <MediaIconsStyled>
        <FontAwesomeIcon
          icon={faYoutube}
          style={{ color: isYoutubeUrl ? '#ff0000' : '#646464' }}
          title="Turns red if URL is YouTube"
        />
      </MediaIconsStyled>
      <InputTextStyled
        autoFocus
        placeholder="Paste YouTube URL here"
        value={textUrlInput}
        onChange={(e) => setTextUrlInput(e.target.value)}
        onKeyUpCapture={() => validateUrl(textUrlInput)}
      />
      <ButtonGroup fill>
        <Button
          disabled={!textUrlInput || !isYoutubeUrl}
          text="Add"
          onClick={() => onAddClick(textUrlInput)}
          intent="success"
          title="Add video to playlist"
        />
        <Button onClick={onCancelClick}>Cancel</Button>
      </ButtonGroup>
    </div>
  );
};
