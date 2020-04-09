export enum RoomEvent {
  UserJoin = 'join',
  UserUpdate = 'update',
  UserDisconnect = 'disconnect',
}

export enum PlayerEvent {
  Ready = 'ready-player',
  Init = 'init-player',
  Play = 'play-player',
  Pause = 'pause-player',
  Progress = 'progress-player',
}

export enum LogEvent {
  Send = 'send-log',
}

export enum ChatEvent {
  Send = 'send-chat',
}
