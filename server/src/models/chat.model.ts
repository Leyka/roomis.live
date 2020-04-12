import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './../../../shared/types';
// We won't store any chat message in redis database for now
class ChatModel {
  createServerMessage(content: string) {
    return this.createMessage(content, true);
  }

  createUserMessage(content: string, fromUserId: string) {
    return this.createMessage(content, false, fromUserId);
  }

  private createMessage(content: string, fromServer: boolean, fromUserId?: string) {
    const message: ChatMessage = {
      id: uuidv4(),
      date: new Date(),
      content,
      fromUserId,
      fromServer,
    };
    return message;
  }
}

export const chatModel = new ChatModel();
