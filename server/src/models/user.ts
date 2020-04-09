import { User } from '../../../shared/types';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis';
import { Manager } from './manager';
import { roomManager } from './room';

class UserManager extends Manager<User> {
  async createUser(id: string, roomName: string, ip: string, userName?: string) {
    const user: User = {
      id,
      ip,
      room: roomName,
      isHost: false,
      canEdit: false,
      name: userName ?? (await this.generateUniqueName(roomName)),
    };

    this.save(user);
    return user;
  }

  getKey(id: string) {
    return RedisManager.formatKey('user', id);
  }

  async setEdit(userId: string, canEdit: boolean) {
    const user = await this.get(userId);
    if (user) {
      user.canEdit = canEdit;
      this.save(user);
    }
    return user;
  }

  async canEdit(userId: string) {
    const user = await this.get(userId);
    if (!user) return false;
    return user.canEdit;
  }

  async isHost(userId: string) {
    const user = await this.get(userId);
    if (!user) return false;
    return user.isHost;
  }

  private async generateUniqueName(roomName: string) {
    let candidateName = generateAnimalName();
    let isUnique = await roomManager.userNameUniqueInRoom(roomName, candidateName);

    while (!isUnique) {
      candidateName = generateAnimalName();
      isUnique = await roomManager.userNameUniqueInRoom(roomName, candidateName);
    }

    return candidateName;
  }
}

export const userManager = new UserManager();
