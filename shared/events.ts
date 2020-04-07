export enum RoomEvent {
  UserJoin = 'join',
  UserDisconnect = 'disconnect',
}

export enum PlayerEvent {
  Ready = 'ready-player',
  Start = 'start-player',
  Play = 'play-player',
  Pause = 'pause-player',
}

export enum LogEvent {
  Send = 'send-log',
}

export enum ChatEvent {
  Send = 'send-chat',
}
