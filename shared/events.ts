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
}

export enum LogEvent {
  Send = 'send-log',
}

export enum ChatEvent {
  Send = 'send-chat',
}
