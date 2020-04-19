import { socket } from '@/utils/socket';
import { Button, Checkbox, TextArea } from '@blueprintjs/core';
import { ChatEvent } from '@shared/events';
import { ChatMessage } from '@shared/types';
import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const MessagesStyled = styled.div`
  max-height: 77vh;
  overflow-y: auto;
  padding: 10px;
  vertical-align: baseline;
`;

const ChatBoxStyled = styled.div`
  padding: 10px;
  height: 17vh;
  border-top: 1px solid #d3d4d4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TextAreaStyle = styled(TextArea)`
  resize: none;
  font-family: sans-serif;
  margin-bottom: 5px;
`;

const ChatActionStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-bottom: 0;
  font-size: 13px;
`;

export const Chat: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [sendWithEnterKey, setSendWithEnterKey] = useState(true);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    socket.on(ChatEvent.NewMessage, (message: ChatMessage) =>
      setMessages((messages) => [...messages, message])
    );
  }, []);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      messagesEndRef.current?.scrollIntoView();
    };
    scrollMessagesToBottom();

    // Listen when window resize
    window.addEventListener('resize', scrollMessagesToBottom);
    // Remove listener
    return () => {
      window.removeEventListener('resize', scrollMessagesToBottom);
    };
  }, [messages]);

  const sendMessage = () => {
    if (!message) return;
    socket.emit(ChatEvent.Send, { message });
    setMessage('');
  };

  const onKeyPress = (e) => {
    if (e.which === 13 && sendWithEnterKey && !e.shiftKey) {
      // Enter key
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ContainerStyled>
      <MessagesStyled>
        {messages.map((message) => {
          return message.fromServer ? (
            <ServerMessage key={message.id} content={message.content} />
          ) : (
            <UserMessage key={message.id} message={message} />
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesStyled>
      <ChatBoxStyled>
        <TextAreaStyle
          growVertically={false}
          placeholder="Type something cool"
          fill
          onKeyPress={onKeyPress}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <ChatActionStyled>
          <CheckboxStyled
            checked={sendWithEnterKey}
            onChange={() => setSendWithEnterKey(!sendWithEnterKey)}
            label="Send with enter key"
          />
          <Button text="Send" small onClick={sendMessage} />
        </ChatActionStyled>
      </ChatBoxStyled>
    </ContainerStyled>
  );
};

// Message sent from server

const ServerMessageSyled = styled.p`
  color: #797979;
  font-size: 12px;
  font-weight: 300;
`;

const ServerMessage = ({ content }) => {
  return <ServerMessageSyled>{content}</ServerMessageSyled>;
};

// Message sent from user
interface UserMessageProps {
  message: ChatMessage;
}

const UserMessage: FC<UserMessageProps> = ({ message }) => {
  return (
    <p>
      <strong style={{ color: `#${message.userColor}` }}>{message.userName}</strong>
      {` : ${message.content}`}
    </p>
  );
};
