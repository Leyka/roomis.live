import { Playlist, Videos } from '@shared/types';
import { action, computed, observable } from 'mobx';
import { RootStore } from './index';

export class PlaylistStore {
  readonly rootStore: RootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable videos: Videos = {};

  @observable archive: Videos = {};

  @action set(playlist: Playlist) {
    this.videos = playlist.videos;
    this.archive = playlist.archive;
  }

  @computed get videosSize() {
    return Object.keys(this.videos).length;
  }
}
