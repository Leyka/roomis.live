import { Socket } from 'socket.io';
import { RoomEvent } from '../../../shared/events';
import { onRoomDisconnect, onRoomJoin } from './room';

export function handleSocketEvents(socket: Socket) {
  // --- Room ---
  socket.on(RoomEvent.UserJoin, ({ roomName }) => onRoomJoin(socket, roomName));
  socket.on(RoomEvent.UserDisconnect, () => onRoomDisconnect(socket));
  // --- Player ---
}
