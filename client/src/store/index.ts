import { createContext, useContext } from 'react';
import { LivePlayerStore } from './player';
import { RoomStore } from './room';
import { UserStore } from './user';

export class RootStore {
  readonly userStore: UserStore;
  readonly roomStore: RoomStore;
  readonly livePlayerStore: LivePlayerStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.roomStore = new RoomStore(this);
    this.livePlayerStore = new LivePlayerStore(this);
  }
}

// Create unique instance
export const initialStore = new RootStore();
export const RootStoreContext = createContext(initialStore);
export const useRootStore = () => useContext(RootStoreContext);
