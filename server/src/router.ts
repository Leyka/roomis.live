import { Socket } from 'socket.io';
import { PlayerEvent, RoomEvent, UserEvent } from '../../shared/events';
import { PlayerController } from './controllers/player.controller';
import { RoomController } from './controllers/room.controller';

export function dispatchEvents(socket: Socket) {
  // --- Room ---
  socket.on(UserEvent.Join, ({ roomName }) => RoomController.onRoomJoin(socket, roomName));
  socket.on(UserEvent.Disconnect, () => RoomController.onRoomDisconnect(socket));
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
