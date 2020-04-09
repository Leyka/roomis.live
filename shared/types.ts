export interface Player {
  id: string;
  isPlaying: boolean;
  playedSeconds: number;
  videoUrl?: string;
  lastTimeCheck?: Date;
}

export enum Source {
  Youtube,
  SoundCloud,
}

export interface Video {
  id: string;
  url: string;
  source: Source;
  addedBy: string;
}

export interface User {
  id: string;
  name: string;
  room: string;
  isHost: boolean;
  canEdit: boolean;
  ip?: string;
}

export type PlaylistQueue = {
  [id: string]: Video;
};

export type Users = {
  [id: string]: User;
};

export interface Room {
  id: string;
  name: string;
  users: Users;
  hostUserId: string;
  queue?: PlaylistQueue;
  currentPlayingId?: string;
}
