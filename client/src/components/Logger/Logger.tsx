import { LogEvent } from '@shared/events';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  socket: SocketIOClient.Socket;
}

export const Logger: FC<Props> = (props) => {
  const [messages, setMessages] = useState<string[]>([]);
  const { socket } = props;

  useEffect(() => {
    socket.on(LogEvent.Send, (message) => setMessages([...messages, message]));
  }, [socket, messages]);

  return (
    <div>
      <h4>Logs</h4>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};
