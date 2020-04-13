import { kebabCase } from 'lodash';
import { BaseModel } from '.';
import { RedisManager } from '../utils/redis-manager';
import { YouTube } from '../utils/youtube';
import { Playlist, Source, Video, VideoInfos } from './../../../shared/types';

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

    const videoInfos = await this.getVideoInfos(source, url);
    const video: Video = {
      ...videoInfos,
      addedByUserId,
      source,
    };

    playlist.videos[video.id] = video;
    this.save(playlist);
    return playlist;
  }

  async deleteVideo(roomName: string, videoId: string, moveToArchive = false) {
    const playlist = await this.get(roomName);
    if (!playlist) return;

    const video = { ...playlist.videos[videoId] };
    delete playlist.videos[videoId];

    if (moveToArchive) {
      playlist.archive[video.id] = video;
    }

    this.save(playlist);
    return playlist;
  }

  /** Returns video infos depending of course */
  async getVideoInfos(source: Source, url: string) {
    let infos: VideoInfos;
    switch (source) {
      case Source.Youtube:
        infos = await YouTube.getVideoInfos(url);
        break;
    }

    return infos;
  }

  /** Returns key of player. Example if roomName is 'foo' it would return 'player:foo' */
  getKey(id: string) {
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('playlist', formattedName);
  }
}

export const playlistModel = new PlaylistModel();
