import { Socket } from 'socket.io';
import { PlayerEvent } from '../../../shared/events';
import { playerModel, userModel } from '../models';

export module PlayerController {
  export async function onPlayerReady(socket: Socket, roomName: string) {
    const player = await playerModel.get(roomName);
    socket.emit(PlayerEvent.Init, player);
  }

  export async function onPlayerPlay(socket: Socket, roomName: string) {
    const user = await userModel.get(socket.id);
    if (!user || !user.canEdit) return;

    // Update player in DB
    let player = await playerModel.get(roomName);
    player.isPlaying = true;
    playerModel.save(player);
    // Send message to other users in the same room that we asked to Play
    socket.broadcast.to(roomName).emit(PlayerEvent.Play, {
      playedSeconds: player.playedSeconds,
    });
  }

  export async function onPlayerPause(socket: Socket, roomName: string) {
    const user = await userModel.get(socket.id);
    if (!user || !user.canEdit) return;

    // Send message to other users in the same room that we asked to Pause
    socket.broadcast.to(roomName).emit(PlayerEvent.Pause);

    // Update player in DB
    let player = await playerModel.get(roomName);
    player.isPlaying = false;
    playerModel.save(player);
  }

  export async function onPlayerProgress(socket: Socket, roomName: string, playedSeconds: number) {
    const user = await userModel.get(socket.id);
    if (!user || !user.isHost) return;

    let player = await playerModel.get(roomName);
    player.playedSeconds = playedSeconds;
    playerModel.save(player);
  }

  export async function onPrepareToPlay(socket: Socket, roomName: string) {
    let player = await playerModel.get(roomName);
    player.isPlaying = true;
    playerModel.save(player);
  }
}
