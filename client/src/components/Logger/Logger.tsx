import { socket } from '@/utils/socket';
import { LogEvent } from '@shared/events';
import React, { FC, useEffect, useState } from 'react';

export const Logger: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on(LogEvent.Send, (message) =>
      setMessages((messages) => {
        // Keep maximum 5 elements
        if (messages.length > 4) {
          messages.splice(messages.length - 1, 1);
        }
        messages.unshift(message);
        return messages;
      })
    );
  }, []);

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
