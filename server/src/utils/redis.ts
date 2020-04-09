import * as Redis from 'ioredis';

export module RedisManager {
  // Single instance of Redis
  export const redis = new Redis();

  /** Format key name to turns into "type:key" format
   * Example {type: 'room', key: 'music'} will returns 'room:music' */
  export function formatKey(type: string, key: string) {
    return `${type}:${key}`;
  }

  export function scan(pattern: string) {
    const stream = redis.scanStream({
      match: pattern,
      count: 100,
    });

    return stream;

    stream.on('data', function (resultKeys) {
      // `resultKeys` is an array of strings representing key names.
      // Note that resultKeys may contain 0 keys, and that it will sometimes
      // contain duplicates due to SCAN's implementation in Redis.
      for (var i = 0; i < resultKeys.length; i++) {
        console.log(resultKeys[i]);
      }

      stream.emit('Done');
    });
    stream.on('end', function () {
      console.log('all keys have been visited');
    });
  }

  /** Fetch redis database and returns object in JSON */
  export async function getObject<T>(key: string): Promise<T> {
    const strValue = await redis.get(key);
    if (!strValue) return undefined;
    return JSON.parse(strValue);
  }

  export async function getObjectsAsArray<T>(keyPattern: string) {
    const keys = await redis.keys(keyPattern);
    return Promise.all(keys.map((key) => getObject<T>(key)));
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
