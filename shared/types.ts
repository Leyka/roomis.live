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
  room: string;
}

export type PlaylistQueue = {
  [id: string]: Video;
};

export type RoomUsers = {
  [id: string]: User;
};

export interface Room {
  name: string;
  queue: PlaylistQueue;
  currentPlayingId: string;
  users: RoomUsers;
  hostUserId: string;
  guestsHasPower: boolean;
}

export type Rooms = {
  [name: string]: Room;
};
