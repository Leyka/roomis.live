import { BaseModel } from '.';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis-manager';
import { Room, User } from './../../../shared/types';
import { roomModel } from './room';

class UserModel extends BaseModel<User> {
  async createUser(id: string, ip: string, room: Room, userName?: string) {
    const isHost = room.hostId === id;
    const user: User = {
      id,
      ip,
      room: room.name,
      isHost,
      canEdit: isHost || room.guestsCanEdit,
      name: userName ?? (await this.generateName(room.name)),
    };

    this.save(user);
    return user;
  }

  /*
  async get(id: string) {
    const user = await this.get(id);
    const userRoom = await roomModel.get(user.room);

    const isHost = user.id === userRoom.hostId;
    const canEdit = isHost || userRoom.guestsCanEdit;

    const userWithRights: User = {
      ...user,
      isHost,
      canEdit,
    };

    return userWithRights;
  }
  */

  private async generateName(roomName: string) {
    let candidateName = generateAnimalName();
    let isUnique = await this.nameIsUnique(roomName, candidateName);
    while (!isUnique) {
      candidateName = generateAnimalName();
      isUnique = await this.nameIsUnique(roomName, candidateName);
    }
    return candidateName;
  }

  private async nameIsUnique(roomName: string, candidateName: string) {
    const room = await roomModel.get(roomName);
    if (!room) return true;

    const roomUsers = await roomModel.getRoomUsers(roomName);
    const foundSimilarName = roomUsers.some((user) => user && user.name === candidateName);
    return !foundSimilarName;
  }

  getKey(id: string) {
    return RedisManager.formatKey('user', id);
  }
}

export const userModel = new UserModel();
