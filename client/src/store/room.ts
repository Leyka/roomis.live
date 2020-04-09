import { observable } from 'mobx';
import { RootStore } from './index';

export class RoomStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable roomName: string = '';
}
