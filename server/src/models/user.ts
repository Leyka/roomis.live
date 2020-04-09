import { User } from '../../../shared/types';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis';
import { Manager } from './manager';
import { roomManager } from './room';

class UserManager extends Manager<User> {
  createUser(id: string, roomName: string, ip: string, userName?: string) {
    const user: User = {
      id,
      ip,
      room: roomName,
      isHost: false,
      name: userName ?? this.generateUniqueName(roomName),
    };

    this.save(user);
    return user;
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
