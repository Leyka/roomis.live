import { Socket } from 'socket.io';
import { PlayerEvent, RoomEvent } from '../../shared/events';
import { PlayerController } from './controllers/player.controller';
import { RoomController } from './controllers/room.controller';

export function dispatchEvents(socket: Socket) {
  // --- Room ---
  socket.on(RoomEvent.UserJoin, ({ roomName }) => RoomController.onRoomJoin(socket, roomName));
  socket.on(RoomEvent.UserDisconnect, () => RoomController.onRoomDisconnect(socket));
  socket.on(RoomEvent.GuestsCanEdit, ({ canEdit }) =>
    RoomController.onGuestsRightChange(socket, canEdit)
  );
  // --- Player ---
  socket.on(PlayerEvent.Ready, ({ roomName }) => PlayerController.onPlayerReady(socket, roomName));
  socket.on(PlayerEvent.Play, ({ roomName }) => PlayerController.onPlayerPlay(socket, roomName));
  socket.on(PlayerEvent.Pause, ({ roomName }) => PlayerController.onPlayerPause(socket, roomName));
  socket.on(PlayerEvent.Progress, ({ roomName, playedSeconds }) =>
    PlayerController.onPlayerProgress(socket, roomName, playedSeconds)
  );
}
