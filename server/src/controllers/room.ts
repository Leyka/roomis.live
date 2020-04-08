import { Socket } from 'socket.io';
import { roomManager } from '../models/room';
import { userManager } from '../models/user';
import { logger } from '../utils/logger';

export async function onRoomJoin(socket: Socket, roomName: string, userName?: string) {
  const ip = socket.handshake.address;
  const user = await userManager.createUser(socket.id, roomName, ip, userName);
  roomManager.join(roomName, user);

  logger.info(`User ${JSON.stringify(user)} joined room ${roomName}`);
}

export async function onRoomDisconnect(socket: Socket) {
  const user = await userManager.getUser(socket.id);
  if (user) {
    await roomManager.leave(user.room, user.id);
    await userManager.removeUser(user.id);
    logger.info(`User ${JSON.stringify(user)} joined room ${user.room}`);
  }
}
