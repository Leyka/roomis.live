import { kebabCase } from 'lodash';
import { Room, User } from '../../../shared/types';
import { RedisManager } from '../utils/redis';
import { Manager } from './types';

class RoomManager implements Manager<Room> {
  /** Create or update room when user joins */
  async join(name: string, user: User) {
    let room = await this.get(name);
    if (room) {
      // Existing room, add new user
      room.users[user.id] = user;
    } else {
      // New room
      room = this.createRoom(name, user);
    }

    this.save(room);
    return room;
  }

  async leave(name: string, userId: string) {
    let room = await this.get(name);
    if (!room) return;

    delete room.users[userId];

    // It was last user? Then delete room
    const roomIsEmpty = Object.keys(room.users).length === 0;
    if (roomIsEmpty) {
      this.remove(name);
      return;
    }

    // We still have users in this room at this point
    // Check if it's the host who left. If so, transfer host rights to next user
    if (userId === room.hostUserId) {
      const nextUserId = Object.keys(room.users)[0];
      room.hostUserId = nextUserId;
    }

    this.save(room);
    return room;
  }

  /** Returns true if username is unique in given room */
  async userNameIsUnique(roomName: string, candidateUserName: string) {
    const room = await this.get(roomName);
    if (!room) return true;

    const usersList = Object.values(room.users);
    return !usersList.some((u) => u.name === candidateUserName);
  }

  get(name: string) {
    const key = this.getKey(name);
    return RedisManager.getObject<Room>(key);
  }

  private createRoom(name: string, host: User) {
    const users = {
      [host.id]: host,
    };

    const room: Room = {
      name,
      users,
      hostUserId: host.id,
      guestsHasPower: false,
    };

    return room;
  }

  save(room: Room) {
    const key = this.getKey(room.name);
    RedisManager.set(key, room);
  }

  remove(name: string) {
    const key = this.getKey(name);
    RedisManager.remove(key);
  }

  getKey(name: string) {
    // Example kebabCase: '__FOO_BAR__' => 'foo-bar' ; 'Foo Bar' => 'foo-bar'
    const formattedName = kebabCase(name);
    return RedisManager.formatKey('room', formattedName);
  }
}

export const roomManager = new RoomManager();
