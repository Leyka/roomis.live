import { kebabCase } from 'lodash';
import { RedisManager } from '../utils/redis';
import { Player } from './../../../shared/types';
import { Manager } from './manager';

/** A Player is associated to a room */
class PlayerManager extends Manager<Player> {
  createPlayer(roomName: string) {
    const player: Player = {
      id: roomName,
      isPlaying: false,
      playedSeconds: 0,
    };

    this.save(player);
    return player;
  }

  /** Returns key of player. Example if roomName is 'foo' it would return 'player:foo' */
  getKey(id: string) {
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('player', formattedName);
  }
}

export const playerManager = new PlayerManager();
