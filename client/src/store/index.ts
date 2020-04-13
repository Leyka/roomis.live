import { createContext, useContext } from 'react';
import { PlaylistStore } from './playlist.store';
import { RoomStore } from './room.store';
import { UserStore } from './user.store';

export class RootStore {
  readonly userStore: UserStore;
  readonly roomStore: RoomStore;
  readonly playlistStore: PlaylistStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.roomStore = new RoomStore(this);
    this.playlistStore = new PlaylistStore(this);
  }
}

// Create unique instance
export const initialStore = new RootStore();
export const RootStoreContext = createContext(initialStore);
export const useRootStore = () => useContext(RootStoreContext);

export * from './room.store';
export * from './user.store';
