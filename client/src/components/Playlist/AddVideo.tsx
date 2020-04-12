import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const InputTextStyled = styled(InputGroup)`
  margin-bottom: 10px;
`;

interface Props {
  hidden: boolean;
  isValid: boolean;
  onAddClick(text: string): void;
  onCancelClick(): void;
}

export const AddVideo: FC<Props> = (props) => {
  const [textUrlInput, setTextUrlInput] = useState('');
  const { hidden, isValid, onAddClick } = props;

  const onCancelClick = () => {
    // Clear text
    setTextUrlInput('');
    props.onCancelClick();
  };

  return (
    <div hidden={hidden}>
      <InputTextStyled
        placeholder="Paste YouTube URL here"
        value={textUrlInput}
        onChange={(e) => setTextUrlInput(e.target.value)}
      />
      <ButtonGroup fill>
        <Button
          disabled={!textUrlInput || !isValid}
          text="Add"
          onClick={() => onAddClick(textUrlInput)}
          intent="success"
        />
        <Button onClick={onCancelClick}>Cancel</Button>
      </ButtonGroup>
    </div>
  );
};
