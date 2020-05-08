import { Socket } from 'socket.io';
import { ChatEvent, UserEvent } from '../../../shared/events';
import { roomModel, userModel } from '../models';
import { logger } from '../utils/logger';
import { PlaylistEvent, RoomEvent } from './../../../shared/events';
import { io } from './../app';
import { chatModel } from './../models/chat.model';
import { playlistModel } from './../models/playlist.model';

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
    const playlist = await playlistModel.get(room.name);

    // Update socket
    socket.join(user.room);
    socket.emit(UserEvent.Update, user);
    socket.emit(PlaylistEvent.Update, playlist);
    io.in(user.room).emit(RoomEvent.Update, room);
    socket.emit(ChatEvent.NewMessage, chatModel.createServerMessage(`Welcome to the room !`));
    socket.broadcast
      .to(user.room)
      .emit(ChatEvent.NewMessage, chatModel.createServerMessage(`${user.name} joined the room`));

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

      socket.to(newHost.id).emit(UserEvent.Update, newHost);
      messageToTheRoom = `${messageToTheRoom} and ${newHost.name} is the new host`;
    }

    socket.broadcast
      .to(leavingUser.room)
      .emit(ChatEvent.NewMessage, chatModel.createServerMessage(messageToTheRoom));

    socket.broadcast.to(leavingUser.room).emit(RoomEvent.Update, room);

    logger.info(`User ${JSON.stringify(leavingUser)} left room ${leavingUser.room}`);
  }

  export async function onGuestsRightChange(socket: Socket, canEdit: boolean) {
    const user = await userModel.get(socket.id);
    if (!user || !user.isHost) return;

    const usersDict = await roomModel.setGuestsRight(user.room, canEdit);
    if (!usersDict) return;

    const room = await roomModel.get(user.room);
    io.in(user.room).emit(RoomEvent.Update, room);

    Object.values(usersDict).forEach((user) => {
      // Send message to each user (except host) with updated user object
      if (user.isHost) return;
      socket.to(user.id).emit(UserEvent.Update, user);
    });

    const message = canEdit
      ? 'Guests can now add/play/pause video 🥳'
      : 'Host revoked the editing access';
    io.in(user.room).emit(ChatEvent.NewMessage, chatModel.createServerMessage(message));
  }
}
