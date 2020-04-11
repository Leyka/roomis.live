import { socket } from '@/utils/socket';
import { LogEvent } from '@shared/events';
import React, { FC, useEffect, useState } from 'react';

export const Logger: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on(LogEvent.Send, (message) =>
      setMessages((messages) => {
        // Keep maximum 2 messages
        if (messages.length > 2) {
          messages.splice(messages.length - 1, 1);
        }
        return [message, ...messages];
      })
    );
  }, []);

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};
