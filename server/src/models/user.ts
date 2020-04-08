import { User } from '../../../shared/types';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis';
import { roomManager } from './room';
import { Manager } from './types';

class UserManager implements Manager<User> {
  async createUser(id: string, roomName: string, ip: string, userName?: string) {
    const user: User = {
      id,
      ip,
      room: roomName,
      name: userName ?? this.generateUniqueName(roomName),
    };

    await this.save(user);
    return user;
  }

  get(id: string) {
    const key = this.getKey(id);
    return RedisManager.getObject<User>(key);
  }

  save(user: User) {
    const key = this.getKey(user.id);
    RedisManager.set(key, user);
  }

  remove(id: string) {
    const key = this.getKey(id);
    RedisManager.remove(key);
  }

  getKey(id: string) {
    return RedisManager.formatKey('user', id);
  }

  private generateUniqueName(roomName: string) {
    let candidateName = generateAnimalName();
    while (!roomManager.userNameIsUnique(roomName, candidateName)) {
      candidateName = generateAnimalName();
    }

    return candidateName;
  }
}

export const userManager = new UserManager();
