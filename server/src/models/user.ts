import { User, Users } from '../../../shared/types';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis';
import { roomManager } from './room';

const USERS_KEY = 'users';

class UserManager {
  async createUser(id: string, roomName: string, ip: string, userName?: string) {
    const user: User = {
      id,
      ip,
      name: userName ?? this.generateUniqueName(roomName),
      room: roomName,
    };

    await this.saveUser(user);
    return user;
  }

  async getAllUsers() {
    const users = await RedisManager.getObject<Users>(USERS_KEY);
    return users ?? {};
  }

  async getUser(id: string) {
    const users = await this.getAllUsers();
    return users[id];
  }

  async saveUser(user: User) {
    let users = await this.getAllUsers();
    users[user.id] = user;
    RedisManager.set(USERS_KEY, users);
  }

  async removeUser(userId: string) {
    let users = await this.getAllUsers();
    if (!users) return;

    delete users[userId];

    const usersIsEmpty = Object.keys(users).length === 0;
    if (usersIsEmpty) {
      // Delete users key
      RedisManager.remove(USERS_KEY);
    } else {
      // Update users key
      RedisManager.set(USERS_KEY, users);
    }
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
