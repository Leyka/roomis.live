import { createContext, useContext } from 'react';
import { RoomStore } from './room';
import { UserStore } from './user';

export class RootStore {
  readonly userStore: UserStore;
  readonly roomStore: RoomStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.roomStore = new RoomStore(this);
  }
}

// Create unique instance
export const initialStore = new RootStore();
export const RootStoreContext = createContext(initialStore);
export const useRootStore = () => useContext(RootStoreContext);
