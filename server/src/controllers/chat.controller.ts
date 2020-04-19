import { io } from './../app';
import { ChatEvent } from './../../../shared/events';
import { chatModel } from './../models/chat.model';
import { userModel } from './../models/user.model';
import { Socket } from 'socket.io';

export module ChatController {
  export async function onMessageSend(socket: Socket, messageContent: string) {
    const user = await userModel.get(socket.id);
    if (!user) return;

    const msg = chatModel.createUserMessage(messageContent, user.name, user.color);
    io.in(user.room).emit(ChatEvent.NewMessage, msg);
  }
}
