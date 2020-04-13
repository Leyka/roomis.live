import { Socket } from 'socket.io';
import { PlaylistEvent } from './../../../shared/events';
import { Source } from './../../../shared/types';
import { io } from './../app';
import { playlistModel } from './../models/playlist.model';
import { userModel } from './../models/user.model';
export module PlaylistController {
  export async function onNewVideo(
    socket: Socket,
    roomName: string,
    source: Source,
    videoUrl: string
  ) {
    // Check if user has rights
    const user = await userModel.get(socket.id);
    if (!user || !user.canEdit) return;
    // Add video and update playlist
    const playlist = await playlistModel.addVideo(roomName, source, videoUrl, user.id);
    if (!playlist) return;
    // Broadcast to everyone that playlist has changed
    io.in(roomName).emit(PlaylistEvent.Update, playlist);
  }
}
