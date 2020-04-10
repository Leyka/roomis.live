import { kebabCase } from 'lodash';
import { BaseModel } from '.';
import { RedisManager } from '../utils/redis-manager';
import { Player } from './../../../shared/types';

/** A Player is associated to a room */
class PlayerModel extends BaseModel<Player> {
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

export const playerModel = new PlayerModel();
