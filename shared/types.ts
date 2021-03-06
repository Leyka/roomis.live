export interface Player {
  id: string;
  isPlaying: boolean;
  playedSeconds: number;
  videoUrl?: string;
}

export enum Source {
  Youtube = 'youtube',
  SoundCloud = 'soundcloud',
}

export interface VideoInfos {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  channel?: string;
}

export interface Video extends VideoInfos {
  source: Source;
  addedByUserId: string;
}

export type Videos = {
  [id: string]: Video;
};

export interface Playlist {
  id: string;
  videos: Videos;
  archive: Videos;
}

export interface User {
  id: string;
  ip: string;
  name: string;
  color: string;
  room: string;
  isHost: boolean;
  canEdit: boolean;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  guestsCanEdit: boolean;
  userIds: string[];
  currentPlayingId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  date: Date;
  fromServer: boolean;
  userName: string;
  userColor: string;
}
