import { Socket } from 'socket.io';
import { roomManager } from '../models/room';
import { userManager } from '../models/user';
import { logger } from '../utils/logger';

export module RoomController {
  export async function onRoomJoin(socket: Socket, roomName: string, userName?: string) {
    const ip = socket.handshake.address;
    const user = userManager.createUser(socket.id, roomName, ip, userName);
    // Update DB
    await roomManager.join(roomName, user);

    // Update socket
    socket.join(roomName);

    logger.info(`User ${JSON.stringify(user)} joined room ${roomName}`);
  }

  export async function onRoomDisconnect(socket: Socket) {
    const user = await userManager.get(socket.id);
    if (user) {
      // Update DB
      await roomManager.leave(user.room, user.id);
      await userManager.remove(user.id);

      // Update socket
      socket.leave(user.room);

      logger.info(`User ${JSON.stringify(user)} joined room ${user.room}`);
    }
  }
}
