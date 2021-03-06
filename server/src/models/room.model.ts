import { kebabCase } from 'lodash';
import { BaseModel, playerModel, userModel } from '.';
import { Room, User } from '../../../shared/types';
import { RedisManager } from '../utils/redis-manager';
import { playlistModel } from './playlist.model';

class RoomModel extends BaseModel<Room> {
  /** Create or update room when user joins */
  async join(roomName: string, userId: string) {
    let room = await this.get(roomName);
    if (room) {
      // Exists
      room.userIds = room.userIds.concat(userId);
    } else {
      // New
      room = this.createRoom(roomName, userId);
      playerModel.createPlayer(roomName, room.hostId);
      playlistModel.createPlaylist(roomName);
    }

    this.save(room);
    return room;
  }

  /** Remove user from room */
  async leave(roomName: string, userId: string) {
    let room = await this.get(roomName);
    if (!room) return;

    const userIndex = room.userIds.indexOf(userId);
    if (userIndex < 0) {
      // User not found
      return;
    }

    // Delete user
    room.userIds.splice(userIndex, 1);

    // Last user? Delete room
    if (Object.keys(room.userIds).length === 0) {
      this.remove(roomName);
      playerModel.remove(roomName);
      playlistModel.remove(roomName);
      return undefined;
    }

    // Transfer host to next user if it's host leaving
    if (userId === room.hostId) {
      const newHostId = Object.values(room.userIds)[0];
      room.hostId = newHostId;

      // Update user
      let newHost = await userModel.get(newHostId);
      newHost.isHost = true;
      newHost.canEdit = true;
      userModel.save(newHost);
    }

    this.save(room);
    return room;
  }

  private createRoom(roomName: string, hostId: string) {
    const userIds = [hostId];
    const room: Room = {
      id: roomName,
      name: roomName,
      userIds,
      hostId,
      guestsCanEdit: false,
    };
    return room;
  }

  async getRoomUsers(roomName: string) {
    const room = await this.get(roomName);
    const keys = room.userIds.map((id) => userModel.getKey(id));
    return RedisManager.getManyObjects<User>(keys);
  }

  async setGuestsRight(roomName: string, canEdit: boolean) {
    const room = await this.get(roomName);
    if (!room) return;

    // Update room
    room.guestsCanEdit = canEdit;
    this.save(room);

    // Update users
    let updatedUsersDict: { [id: string]: User } = {};
    const users = await this.getRoomUsers(roomName);
    users.forEach((user) => {
      if (user.id === room.hostId) return;
      const key = userModel.getKey(user.id);
      updatedUsersDict[key] = {
        ...user,
        canEdit,
      };
    });

    if (Object.keys(updatedUsersDict).length > 0) {
      RedisManager.setMany(updatedUsersDict);
    }

    return updatedUsersDict;
  }

  getKey(id: string) {
    // Example kebabCase: __FOO BAR__ => 'foo-bar'
    const formattedName = kebabCase(id);
    return RedisManager.formatKey('room', formattedName);
  }
}

export const roomModel = new RoomModel();
