import { kebabCase } from 'lodash';
import { Room, User } from '../../../shared/types';
import { generateAnimalName } from '../utils/generator';
import { RedisManager } from '../utils/redis';
import { Model } from './base-model';
import { playerModel } from './player';

class RoomModel extends Model<Room> {
  /** Create or update room when user joins */
  async join(roomName: string, userId: string, userIp: string, userName?: string) {
    let user = await this.createUser(userId, userIp, roomName, userName);
    let room = await this.get(roomName);
    if (room) {
      // Existing room, add new user
      room.users[user.id] = user;
    } else {
      // New room
      room = this.createRoom(roomName, user);
      playerModel.createPlayer(roomName);
      // Save user as host
      user.isHost = true;
      user.canEdit = true;
    }

    this.save(room);
    return room;
  }

  async leave(roomName: string, userId: string) {
    let room = await this.get(roomName);
    if (!room) return;

    delete room.users[userId];

    // It was last user? Then delete room
    const roomIsEmpty = Object.keys(room.users).length === 0;
    if (roomIsEmpty) {
      this.remove(roomName);
      // Also remove the player associated to the room
      playerModel.remove(roomName);
      return undefined;
    }

    // We still have users in this room at this point
    // Check if it's the host who left. If so, transfer host rights to next user
    if (userId === room.hostUserId) {
      const nextUser = Object.values(room.users)[0];
      room.hostUserId = nextUser.id;
      nextUser.isHost = true;
      nextUser.canEdit = true;
      room.users[nextUser.id] = nextUser;
    }

    this.save(room);
    return room;
  }

  async setGuestsCanEdit(roomName: string, canEdit: boolean) {
    const room = await this.get(roomName);
    if (!room) return;

    await Promise.all(
      Object.values(room.users).map(async (user) => {
        if (!user.isHost) {
          room.users[user.id] = {
            ...user,
            canEdit,
          };
        }
      })
    );

    this.save(room);
  }

  private async createUser(id: string, ip: string, room: string, userName: string) {
    const user: User = {
      id,
      ip,
      room,
      isHost: false,
      canEdit: false,
      name: userName ?? (await this.generateUniqueName(room)),
    };

    return user;
  }

  private createRoom(name: string, host: User) {
    const users = {
      [host.id]: host,
    };

    const room: Room = {
      id: name,
      name,
      users,
      hostUserId: host.id,
    };

    return room;
  }

  get allRooms() {
    return RedisManager.getObjectsAsArray<Room>('room:*');
  }

  async allUsers() {
    const allRooms = await this.allRooms;
    const allUsers = allRooms.flatMap<User>((room) => Object.values(room.users));
    return allUsers;
  }

  async findUser(userId: string) {
    const allUsers = await this.allUsers();
    return allUsers.find((user) => user.id === userId);
  }

  async getUser(userId: string, roomName: string) {
    const room = await this.get(roomName);
    return room.users[userId];
  }

  async userCanEdit(userId: string, roomName: string) {
    const room = await this.get(roomName);
    if (!room) return false;
    const user = room.users[userId];
    return user && user.canEdit;
  }

  async userIsHost(userId: string, roomName: string) {
    const room = await this.get(roomName);
    if (!room) return false;
    return room.hostUserId === userId;
  }

  /** Returns true if username is unique in given room */
  private async userNameUniqueInRoom(roomName: string, candidateUserName: string) {
    const room = await this.get(roomName);
    if (!room) return true;

    const usersList = Object.values(room.users);
    return !usersList.some((u) => u.name === candidateUserName);
  }

  private async generateUniqueName(roomName: string) {
    let candidateName = generateAnimalName();
    let isUnique = await this.userNameUniqueInRoom(roomName, candidateName);
    while (!isUnique) {
      candidateName = generateAnimalName();
      isUnique = await this.userNameUniqueInRoom(roomName, candidateName);
    }

    return candidateName;
  }

  getKey(id: string) {
    // Example kebabCase: '__FOO_BAR__' => 'foo-bar' ; 'Foo Bar' => 'foo-bar'
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('room', formattedName);
  }
}

export const roomManager = new RoomModel();
