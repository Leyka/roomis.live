import * as Redis from 'ioredis';

export module RedisManager {
  // Single instance of Redis
  export const redis = new Redis();

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

  /** Fetch redis database and returns object in JSON */
  export async function getManyObjects<T>(keys: string[]): Promise<T[]> {
    if (!keys) return [];

    const strValues = await redis.mget(...keys);
    if (!strValues) return [];
    return strValues.map((strValue) => JSON.parse(strValue));
  }

  /** Save object as string format in redis database */
  export async function set(key: string, value: any) {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : value;
    redis.set(key, strValue);
  }

  /** Save object as string format in redis database */
  export function setMany(dictKeyValue: { [k: string]: any }) {
    // Stringify values
    Object.keys(dictKeyValue).forEach((key) => {
      const value = dictKeyValue[key];
      dictKeyValue[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    });

    redis.mset(dictKeyValue);
  }

  /** Remove key from database */
  export function remove(key: string) {
    redis.del(key);
  }

  /** Execute multiple remove functions foreach key that matches pattern */
  export async function removeByKeyPattern(keyPattern: string) {
    const keys = await redis.keys(keyPattern);
    redis.mget(...['sss', 'ss']);
    keys.forEach(remove);
  }
}
