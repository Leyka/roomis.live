import { Socket } from 'socket.io';
import { LogEvent, RoomEvent } from '../../../shared/events';
import { roomModel } from '../models/room';
import { logger } from '../utils/logger';
import { userModel } from './../models/user';

export module RoomController {
  export async function onRoomJoin(socket: Socket, roomName: string, userName?: string) {
    // Update DB
    const ip = socket.handshake.address;
    const room = await roomModel.join(roomName, socket.id);
    const user = await userModel.createUser(socket.id, ip, room, userName);

    // Update socket
    socket.join(user.room);
    socket.broadcast.to(user.room).emit(LogEvent.Send, `${user.name} joined the room!`);
    socket.emit(RoomEvent.UserUpdate, user);

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
    socket.broadcast.to(leavingUser.room).emit(LogEvent.Send, `${leavingUser.name} left the room.`);

    // Check if the host left room, if so keep updated the new user, and let everyone else know who is the new host
    if (leavingUser.isHost) {
      const newHost = await userModel.get(room.hostId);
      socket.to(newHost.id).emit(RoomEvent.UserUpdate, newHost);
      socket.id = newHost.id;
      socket.broadcast.to(leavingUser.room).emit(LogEvent.Send, `${newHost.name} is now hosting.`);
      socket.to(newHost.id).emit(LogEvent.Send, 'You are now the host. Feeeeeel the powah!');
    }

    logger.info(`User ${JSON.stringify(leavingUser)} left room ${leavingUser.room}`);
  }
}
