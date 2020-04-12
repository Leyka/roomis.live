import { User } from '@shared/types';
import { action, observable } from 'mobx';
import { RootStore } from './index';

export class UserStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable name: string = '';
  @observable color: string = '';
  @observable isHost: boolean = false;
  @observable canEdit: boolean = false;

  @action set(user: User) {
    this.name = user.name;
    this.isHost = user.isHost;
    this.canEdit = user.canEdit;
    this.color = user.color;
  }
}
