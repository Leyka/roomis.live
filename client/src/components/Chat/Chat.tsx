import { socket } from '@/utils/socket';
import { LogEvent } from '@shared/events';
import { ChatMessage } from '@shared/types';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

export const Chat: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.on(LogEvent.Send, (message: ChatMessage) =>
      setMessages((messages) => [...messages, message])
    );
  }, []);

  return (
    <div>
      {messages.map((message) => {
        return message.fromServer ? (
          <ServerMessage key={message.id} content={message.content} />
        ) : (
          <p key={message.id}>{message.content}</p>
        );
      })}
    </div>
  );
};

const StyledServerMessage = styled.p`
  color: #797979;
  font-size: 13px;
  font-weight: 300;
`;

export const ServerMessage = ({ content }) => {
  return <StyledServerMessage>{content}</StyledServerMessage>;
};
