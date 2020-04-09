import { kebabCase } from 'lodash';
import { Room, User } from '../../../shared/types';
import { RedisManager } from '../utils/redis';
import { Manager } from './manager';
import { playerManager } from './player';
import { userManager } from './user';

class RoomManager extends Manager<Room> {
  /** Create or update room when user joins */
  async join(roomName: string, user: User) {
    let room = await this.get(roomName);
    if (room) {
      // Existing room, add new user
      room.users[user.id] = user;
    } else {
      // New room
      room = this.createRoom(roomName, user);
      playerManager.createPlayer(roomName);
      // Save user as host
      user.isHost = true;
      user.canEdit = true;
      await userManager.save(user);
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
      playerManager.remove(roomName);
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
      await userManager.save(nextUser);
    }

    this.save(room);
    return room;
  }

  /** Returns true if username is unique in given room */
  async userNameUniqueInRoom(roomName: string, candidateUserName: string) {
    const room = await this.get(roomName);
    if (!room) return true;

    const usersList = Object.values(room.users);
    return !usersList.some((u) => u.name === candidateUserName);
  }

  // TODO: Test this function
  async setGuestsCanEdit(roomName: string, canEdit: boolean) {
    const room = await this.get(roomName);
    if (!room) return;

    await Promise.all(
      Object.values(room.users).map(async (user) => {
        if (!user.isHost) {
          const savedUser = await userManager.setEdit(user.id, canEdit);
          room.users[savedUser.id] = savedUser;
        }
      })
    );

    this.save(room);
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

  getKey(id: string) {
    // Example kebabCase: '__FOO_BAR__' => 'foo-bar' ; 'Foo Bar' => 'foo-bar'
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('room', formattedName);
  }
}

export const roomManager = new RoomManager();
