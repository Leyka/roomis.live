export interface Manager<T> {
  get(id: string): Promise<T>;
  save(obj: T);
  remove(id: string);
  getKey(id: string): string;
}
