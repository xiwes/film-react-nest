export interface IRepository<T, K = string> {
  findAll(): Promise<T[]>;
  findById(id: K): Promise<T | null>;
  create(item: T): Promise<T>;
}
