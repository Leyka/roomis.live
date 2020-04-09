import { Socket } from 'socket.io';
import { LogEvent, RoomEvent } from '../../../shared/events';
import { roomManager } from '../models/room';
import { logger } from '../utils/logger';

export module RoomController {
  export async function onRoomJoin(socket: Socket, roomName: string, userName?: string) {
    // Update DB
    const ip = socket.handshake.address;
    await roomManager.join(roomName, socket.id, ip, userName);
    const user = await roomManager.getUser(socket.id, roomName);

    // Update socket
    socket.join(roomName);
    socket.broadcast.to(roomName).emit(LogEvent.Send, `${user.name} joined the room!`);

    socket.emit(RoomEvent.UserUpdate, user);

    logger.info(`User ${JSON.stringify(user)} joined room ${roomName}`);
  }

  export async function onRoomDisconnect(socket: Socket) {
    const leavingUser = await roomManager.findUser(socket.id);

    if (leavingUser) {
      // Update DB
      const room = await roomManager.leave(leavingUser.room, leavingUser.id);
      if (!room) {
        logger.info(`${leavingUser.room} is now empty.`);
        return;
      }

      // Update sockets
      socket.leave(leavingUser.room);
      socket.broadcast
        .to(leavingUser.room)
        .emit(LogEvent.Send, `${leavingUser.name} left the room.`);

      // Check if the host left room, if so keep updated the new user
      // and let everyone else know who is the new host
      if (leavingUser.isHost) {
        const newHost = await roomManager.getUser(room.hostUserId, room.name);

        socket.to(newHost.id).emit(RoomEvent.UserUpdate, newHost);
        socket.broadcast
          .to(leavingUser.room)
          .emit(LogEvent.Send, `${newHost.name} is now hosting.`);
      }

      logger.info(`User ${JSON.stringify(leavingUser)} left room ${leavingUser.room}`);
    }
  }
}
