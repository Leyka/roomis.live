import * as Redis from 'ioredis';

// Single instance of Redis
export const redis = new Redis();

export module RedisManager {
  /** Format key name to turns into "type:key" format
   * Example {type: 'room', key: 'music'} will returns 'room:music' */
  export function formatKey(type: string, key: string) {
    return `${type}:${key}`;
  }

  /** Fetch redis database and returns object in JSON */
  export async function getObject<T>(key: string): Promise<T> {
    const strValue = await redis.get(key);
    if (!strValue) return undefined;
    return JSON.parse(strValue);
  }

  /** Save object as string format in redis database */
  export function set(key: string, value: any) {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : value;
    redis.set(key, strValue);
  }

  /** Remove key from database */
  export function remove(key: string) {
    redis.del(key);
  }

  /** Execute multiple remove functions foreach key that matches pattern */
  export async function removeByKeyPattern(keyPattern: string) {
    const keys = await redis.keys(keyPattern);
    keys.forEach(remove);
  }
}
