import { Socket } from 'socket.io';
import { PlaylistEvent } from './../../../shared/events';
import { Playlist, Source } from './../../../shared/types';
import { io } from './../app';
import { playlistModel } from './../models/playlist.model';
import { userModel } from './../models/user.model';

type PlaylistCallbackFn = (...args: any[]) => Promise<Playlist>;

export module PlaylistController {
  export async function onNewVideo(socket: Socket, roomName: string, source: Source, url: string) {
    const addFn = async () => playlistModel.addVideo(roomName, source, url, socket.id);
    await checkRightsThenBroadcast(socket, roomName, addFn);
  }

  export async function onDeleteVideo(socket: Socket, roomName: string, videoId: string) {
    const deleteFn = async () => playlistModel.deleteVideo(roomName, videoId);
    await checkRightsThenBroadcast(socket, roomName, deleteFn);
  }

  async function checkRightsThenBroadcast(
    socket: Socket,
    roomName: string,
    callback: PlaylistCallbackFn
  ) {
    // 1- Check if user has rights
    const user = await userModel.get(socket.id);
    if (!user || !user.canEdit) return;

    // 2- Do custom stuff
    const playlist = await callback();
    if (!playlist) return;

    // 3- Broadcast to everyone that playlist has changed
    io.in(roomName).emit(PlaylistEvent.Update, playlist);
  }
}
