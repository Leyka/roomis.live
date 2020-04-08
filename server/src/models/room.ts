import { Room, User } from '../../../shared/types';
import { RedisManager } from '../utils/redis';

class RoomManager {
  /** Create or update room when user joins */
  async join(name: string, user: User) {
    let room = await this.getRoom(name);
    if (room) {
      // Existing room, add new user
      room.users[user.id] = user;
    } else {
      // New room
      room = this.createRoom(name, user);
    }

    this.saveRoom(room);
    return room;
  }

  async leave(name: string, userId: string) {
    let room = await this.getRoom(name);
    if (!room) return;

    delete room.users[userId];

    const roomIsEmpty = Object.keys(room.users).length === 0;
    if (roomIsEmpty) {
      // Delete room if it's last user
      this.removeRoom(name);
      return;
    }

    // Otherwise, returns the room without that user
    this.saveRoom(room);
    return room;
  }

  getRoom(name: string) {
    const key = this.getRoomKey(name);
    return RedisManager.getObject<Room>(key);
  }

  /** Returns true if username is unique in given room */
  async userNameIsUnique(roomName: string, candidateUserName: string) {
    const room = await this.getRoom(roomName);
    if (!room) return true;

    const usersList = Object.values(room.users);
    return !usersList.some((u) => u.name === candidateUserName);
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

  private saveRoom(room: Room) {
    const key = this.getRoomKey(room.name);
    RedisManager.set(key, room);
  }

  private removeRoom(name: string) {
    const key = this.getRoomKey(name);
    RedisManager.remove(key);
  }

  private getRoomKey(name: string) {
    return RedisManager.formatKey('room', name);
  }
}

export const roomManager = new RoomManager();
