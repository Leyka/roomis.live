import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './../../../shared/types';
// We won't store any chat message in redis database for now
class ChatModel {
  createServerMessage(content: string) {
    return this.createMessage(content, true);
  }

  createUserMessage(content: string, userName: string, userColor: string) {
    return this.createMessage(content, false, userName, userColor);
  }

  private createMessage(
    content: string,
    fromServer: boolean,
    userName?: string,
    userColor?: string
  ) {
    const message: ChatMessage = {
      id: uuidv4(),
      date: new Date(),
      content,
      fromServer,
      userName,
      userColor,
    };
    return message;
  }
}

export const chatModel = new ChatModel();
