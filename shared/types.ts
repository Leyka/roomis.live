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
  ip: string;
  name: string;
  room: string;
  isHost: boolean;
  canEdit: boolean;
}

export type PlaylistQueue = {
  [id: string]: Video;
};

export interface Room {
  id: string;
  name: string;
  hostId: string;
  guestsCanEdit: boolean;
  userIds: string[];
  queue?: PlaylistQueue;
  currentPlayingId?: string;
}
