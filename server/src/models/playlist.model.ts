import { kebabCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel } from '.';
import { RedisManager } from '../utils/redis-manager';
import { Playlist, Source, Video } from './../../../shared/types';

/** A Player is associated to a room */
class PlaylistModel extends BaseModel<Playlist> {
  createPlaylist(roomName: string) {
    const playlist: Playlist = {
      id: roomName,
      videos: {},
      archive: {},
    };

    this.save(playlist);
    return playlist;
  }

  async addVideo(roomName: string, source: Source, url: string, addedByUserId: string) {
    const playlist = await this.get(roomName);
    if (!playlist) return;

    const video: Video = {
      id: uuidv4(),
      source,
      url,
      addedByUserId,
    };

    playlist.videos[video.id] = video;
    this.save(playlist);
    return playlist;
  }

  /** When video finish, add it to archive */
  async moveVideoToArchive(roomName: string, video: Video) {
    const playlist = await this.get(roomName);
    if (!playlist) return;

    delete playlist.videos[video.id];
    playlist.archive[video.id] = video;

    this.save(playlist);
    return playlist;
  }

  /** Returns key of player. Example if roomName is 'foo' it would return 'player:foo' */
  getKey(id: string) {
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('playlist', formattedName);
  }
}

export const playlistModel = new PlaylistModel();
