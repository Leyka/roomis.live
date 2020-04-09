import { Socket } from 'socket.io';
import { PlayerEvent } from '../../../shared/events';
import { playerManager } from './../models/player';
import { userManager } from './../models/user';

export module PlayerController {
  export async function onPlayerReady(socket: Socket, roomName: string) {
    const player = await playerManager.get(roomName);
    socket.emit(PlayerEvent.Init, player);
  }

  export async function onPlayerPlay(socket: Socket, roomName: string) {
    const canEdit = await userManager.canEdit(socket.id);
    if (!canEdit) return;

    // Send message to other users in the same room that we asked to Play
    let player = await playerManager.get(roomName);
    socket.broadcast.to(roomName).emit(PlayerEvent.Play, { playedSeconds: player.playedSeconds });

    // Update player in DB
    player.isPlaying = true;
    playerManager.save(player);
  }

  export async function onPlayerPause(socket: Socket, roomName: string) {
    const canEdit = await userManager.canEdit(socket.id);
    if (!canEdit) return;

    // Send message to other users in the same room that we asked to Pause
    socket.broadcast.to(roomName).emit(PlayerEvent.Pause);

    // Update player in DB
    let player = await playerManager.get(roomName);
    player.isPlaying = false;
    playerManager.save(player);
  }

  export async function onPlayerProgress(socket: Socket, roomName: string, playedSeconds: number) {
    const isHost = await userManager.isHost(socket.id);
    if (!isHost) return;

    let player = await playerManager.get(roomName);
    player.playedSeconds = playedSeconds;
    playerManager.save(player);
  }
}
