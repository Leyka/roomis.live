export interface Player {
  videoUrl: string;
  currentTimeSec: number;
  isPlaying: boolean;
  lastTimeCheck: Date;
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
}

export type PlaylistQueue = {
  [id: string]: Video;
};

export type Users = {
  [id: string]: User;
};

export interface Room {
  name: string;
  users: Users;
  hostUserId: string;
  guestsHasPower: boolean;
  queue?: PlaylistQueue;
  currentPlayingId?: string;
}

export type Rooms = {
  [name: string]: Room;
};
