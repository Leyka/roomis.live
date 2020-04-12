import { Room } from '@shared/types';
import { action, observable } from 'mobx';
import { RootStore } from './index';

export class RoomStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable roomName: string = '';
  @observable usersCount: number = 1;
  @observable guestsCanEdit: boolean = false;

  @action set(room: Room) {
    this.roomName = room.name;
    this.usersCount = room.userIds.length;
    this.guestsCanEdit = room.guestsCanEdit;
  }
}
