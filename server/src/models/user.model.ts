import { BaseModel } from '.';
import {
  generateAnimalName,
  generateHexColorFromPalette,
  generateHexColorRandom,
} from '../utils/generator';
import { RedisManager } from '../utils/redis-manager';
import { Room, User } from './../../../shared/types';
import { roomModel } from './room.model';

class UserModel extends BaseModel<User> {
  async createUser(id: string, ip: string, room: Room, userName?: string, color?: string) {
    const isHost = room.hostId === id;
    const user: User = {
      id,
      ip,
      room: room.name,
      isHost,
      canEdit: isHost || room.guestsCanEdit,
      name: userName ?? (await this.generateName(room.name)),
      color: color ?? (await this.generateColor(room.name)),
    };

    this.save(user);
    return user;
  }

  private async generateName(roomName: string) {
    let candidateName = generateAnimalName();
    let isUniqueName = await this.nameIsUnique(roomName, candidateName);
    while (!isUniqueName) {
      candidateName = generateAnimalName();
      isUniqueName = await this.nameIsUnique(roomName, candidateName);
    }
    return candidateName;
  }

  private async generateColor(roomName: string) {
    let candidateColor = generateHexColorFromPalette();
    let isUniqueColor = await this.colorIsUnique(roomName, candidateColor);
    let nbTries = 1;

    while (!isUniqueColor && nbTries <= 15) {
      candidateColor = generateHexColorFromPalette();
      isUniqueColor = await this.colorIsUnique(roomName, candidateColor);
      nbTries++;
    }

    // After 15 tries, just pick a random color at this point
    if (nbTries > 15) {
      return generateHexColorRandom();
    }

    return candidateColor;
  }

  private async isUnique(roomName: string, property: string, candidateValue: string) {
    const room = await roomModel.get(roomName);
    if (!room) return true;

    const roomUsers = await roomModel.getRoomUsers(roomName);
    const foundSimilar = roomUsers.some((user) => user && user[property] === candidateValue);
    return !foundSimilar;
  }

  private async nameIsUnique(roomName: string, candidateName: string) {
    return this.isUnique(roomName, 'name', candidateName);
  }

  private async colorIsUnique(roomName: string, candidateColor: string) {
    return this.isUnique(roomName, 'color', candidateColor);
  }

  getKey(id: string) {
    return RedisManager.formatKey('user', id);
  }
}

export const userModel = new UserModel();
