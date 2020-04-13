import { Room, Video } from '@shared/types';
import { action, computed, observable } from 'mobx';
import { RootStore } from './index';

export class RoomStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable roomName: string = '';
  @observable usersCount: number = 1;
  @observable guestsCanEdit: boolean = false;
  @observable videoToPlay: Video | undefined;

  @action set(room: Room) {
    this.roomName = room.name;
    this.usersCount = room.userIds.length;
    this.guestsCanEdit = room.guestsCanEdit;
  }

  @computed get hasVideo() {
    return !!(this.videoToPlay && this.videoToPlay.url);
  }
}
