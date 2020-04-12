import { Socket } from 'socket.io';
import { LogEvent, RoomEvent } from '../../../shared/events';
import { roomModel, userModel } from '../models';
import { logger } from '../utils/logger';
import { chatModel } from './../models/chat.model';

export module RoomController {
  export async function onRoomJoin(
    socket: Socket,
    roomName: string,
    userName?: string,
    userColor?: string
  ) {
    // Update DB
    const ip = socket.handshake.address;
    const room = await roomModel.join(roomName, socket.id);
    const user = await userModel.createUser(socket.id, ip, room, userName, userColor);

    // Update socket
    socket.join(user.room);
    // Log messages
    socket.emit(RoomEvent.UserUpdate, user);
    socket.emit(LogEvent.Send, chatModel.createServerMessage(`Welcome to the room !`));
    socket.broadcast
      .to(user.room)
      .emit(LogEvent.Send, chatModel.createServerMessage(`${user.name} joined the room`));

    logger.info(`User ${JSON.stringify(user)} joined room ${user.room}`);
  }

  export async function onRoomDisconnect(socket: Socket) {
    const leavingUser = await userModel.get(socket.id);
    if (!leavingUser) return;

    // Update DB
    await userModel.remove(leavingUser.id);

    const room = await roomModel.leave(leavingUser.room, leavingUser.id);
    if (!room) {
      logger.info(`${leavingUser.name} was the last user. Room ${leavingUser.room} is now empty.`);
      return;
    }

    // Update sockets
    socket.leave(leavingUser.room);
    let messageToTheRoom = `${leavingUser.name} left the room`;

    // Check if the host left room, if so keep updated the new user, and let everyone else know who is the new host
    if (leavingUser.isHost) {
      const newHost = await userModel.get(room.hostId);

      socket.to(newHost.id).emit(RoomEvent.UserUpdate, newHost);
      messageToTheRoom = `${messageToTheRoom} and ${newHost.name} is the new host`;
    }

    socket.broadcast
      .to(leavingUser.room)
      .emit(LogEvent.Send, chatModel.createServerMessage(messageToTheRoom));

    logger.info(`User ${JSON.stringify(leavingUser)} left room ${leavingUser.room}`);
  }

  export async function onGuestsRightChange(socket: Socket, canEdit: boolean) {
    const user = await userModel.get(socket.id);
    if (!user || !user.isHost) return;

    const usersDict = await roomModel.setGuestsRight(user.room, canEdit);
    if (!usersDict) return;

    const message = canEdit
      ? 'Be free! Host granted this room editing access.'
      : 'Host decided he is the only king in this room... He revoked the editing access.';
    socket.broadcast.to(user.room).emit(LogEvent.Send, chatModel.createServerMessage(message));

    Object.values(usersDict).forEach((user) => {
      // Send message to each user (except host) with updated user object
      if (user.isHost) return;
      socket.to(user.id).emit(RoomEvent.UserUpdate, user);
    });
  }
}
