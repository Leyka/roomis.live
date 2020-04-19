import { ChatEvent } from './../../shared/events';
import { Socket } from 'socket.io';
import { PlayerEvent, PlaylistEvent, RoomEvent, UserEvent } from '../../shared/events';
import { PlayerController } from './controllers/player.controller';
import { PlaylistController } from './controllers/playlist.controller';
import { RoomController } from './controllers/room.controller';
import { ChatController } from './controllers/chat.controller';

export function dispatchEvents(socket: Socket) {
  // --- Room ---
  socket.on(UserEvent.Join, ({ roomName }) => RoomController.onRoomJoin(socket, roomName));
  socket.on(UserEvent.Disconnect, () => RoomController.onRoomDisconnect(socket));
  socket.on(RoomEvent.GuestsCanEdit, ({ canEdit }) =>
    RoomController.onGuestsRightChange(socket, canEdit)
  );
  // --- Player ---
  socket.on(PlayerEvent.PrepareToPlay, ({ roomName }) =>
    PlayerController.onPrepareToPlay(socket, roomName)
  );
  socket.on(PlayerEvent.Ready, ({ roomName }) => PlayerController.onPlayerReady(socket, roomName));
  socket.on(PlayerEvent.Play, ({ roomName }) => PlayerController.onPlayerPlay(socket, roomName));
  socket.on(PlayerEvent.Pause, ({ roomName }) => PlayerController.onPlayerPause(socket, roomName));
  socket.on(PlayerEvent.Progress, ({ roomName, playedSeconds }) =>
    PlayerController.onPlayerProgress(socket, roomName, playedSeconds)
  );
  // --- Playlist ---
  socket.on(PlaylistEvent.NewVideo, ({ roomName, source, videoUrl }) =>
    PlaylistController.onNewVideo(socket, roomName, source, videoUrl)
  );
  socket.on(PlaylistEvent.DeleteVideo, ({ roomName, videoId }) =>
    PlaylistController.onDeleteVideo(socket, roomName, videoId)
  );
  socket.on(PlaylistEvent.SkipVideo, ({ roomName, videoId }) =>
    PlaylistController.onSkipVideo(socket, roomName, videoId)
  );
  // --- Chat ---
  socket.on(ChatEvent.Send, ({ message }) => ChatController.onMessageSend(socket, message));
}
