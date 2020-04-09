import { Socket } from 'socket.io';
import { PlayerEvent } from '../../../shared/events';
import { roomManager } from '../models/room';
import { playerModel } from './../models/player';

export module PlayerController {
  export async function onPlayerReady(socket: Socket, roomName: string) {
    const player = await playerModel.get(roomName);
    socket.emit(PlayerEvent.Init, player);
  }

  export async function onPlayerPlay(socket: Socket, roomName: string) {
    const canEdit = await roomManager.userCanEdit(socket.id, roomName);
    if (!canEdit) return;

    // Send message to other users in the same room that we asked to Play
    let player = await playerModel.get(roomName);
    socket.broadcast.to(roomName).emit(PlayerEvent.Play, { playedSeconds: player.playedSeconds });

    // Update player in DB
    player.isPlaying = true;
    playerModel.save(player);
  }

  export async function onPlayerPause(socket: Socket, roomName: string) {
    const canEdit = await roomManager.userCanEdit(socket.id, roomName);
    if (!canEdit) return;

    // Send message to other users in the same room that we asked to Pause
    socket.broadcast.to(roomName).emit(PlayerEvent.Pause);

    // Update player in DB
    let player = await playerModel.get(roomName);
    player.isPlaying = false;
    playerModel.save(player);
  }

  export async function onPlayerProgress(socket: Socket, roomName: string, playedSeconds: number) {
    const isHost = await roomManager.userIsHost(socket.id, roomName);
    if (!isHost) return;

    let player = await playerModel.get(roomName);
    player.playedSeconds = playedSeconds;
    playerModel.save(player);
  }
}
