import { observable } from 'mobx';
import { RootStore } from './index';

export class UserStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable name: string = '';
}
