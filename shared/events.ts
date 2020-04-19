export enum UserEvent {
  Join = 'user-join',
  Update = 'user-update',
  Disconnect = 'disconnect',
}

export enum RoomEvent {
  Update = 'room-update',
  GuestsCanEdit = 'room-can-edit',
}

export enum PlayerEvent {
  PrepareToPlay = 'player-prepare-to-play',
  Ready = 'player-ready',
  Init = 'player-init',
  Play = 'player-play',
  Pause = 'player-pause',
  Progress = 'player-progress',
  End = 'player-end',
}

export enum PlaylistEvent {
  NewVideo = 'playlist-new-video',
  Update = 'playlist-update',
  DeleteVideo = 'playlist-delete-video',
  SkipVideo = 'playlist-skip-video',
}

export enum ChatEvent {
  Send = 'chat-send',
  NewMessage = 'chat-new-msg',
}
