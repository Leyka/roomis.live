import { Socket } from 'socket.io';

export function onRoomJoin(socket: Socket, roomName: string) {
  console.log(`User ${socket.id} joined room ${roomName}`);
}

export function onRoomDisconnect(socket: Socket) {
  console.log(`User ${socket.id} left room`);
}
