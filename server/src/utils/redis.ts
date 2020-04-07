import * as Redis from 'ioredis';

// Single instance of Redis
export const redis = new Redis();

export module RedisManager {
  export function isStarted() {
    return !!redis;
  }

  /** Fetch redis database and returns object in JSON if it has JSON format otherwise string */
  export async function get<T>(key: string): Promise<T | string> {
    const strValue = await redis.get(key);

    if (!strValue) return null;

    try {
      // Try to cast it to JSON
      const jsonObject = JSON.parse(strValue);
      return jsonObject;
    } catch (err) {
      // At this point we tried to cast to JSON but it's not a JSON.
      // return string value
      return strValue;
    }
  }

  /** Save object as string format in redis database */
  export function set(key: string, value: any) {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : value;
    redis.set(value, strValue);
  }
}
