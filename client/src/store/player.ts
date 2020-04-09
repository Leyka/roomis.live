import { observable } from 'mobx';
import { RootStore } from './index';

export class LivePlayerStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable videoUrl = 'https://www.youtube.com/watch?v=ezOPt7ARM1o';
  @observable isPlaying = false;
  @observable playedSeconds = 0;
}
