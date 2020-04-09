import { RedisManager } from '../utils/redis';

type WithId = {
  id: string;
};

export abstract class Manager<T extends WithId> {
  get(id: string) {
    const key = this.getKey(id);
    return RedisManager.getObject<T>(key);
  }

  save(obj: T) {
    const key = this.getKey(obj.id);
    RedisManager.set(key, obj);
  }

  remove(id: string) {
    const key = this.getKey(id);
    RedisManager.remove(key);
  }

  /** Get formatted Key in redis. Ex: if we getting a key of type 'user', it returns 'user:{key}' */
  abstract getKey(id: string): string;
}
