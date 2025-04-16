// core/interfaces/repositories/IBaseRepository.ts
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T> {
  // CRUD Operations
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  updateById(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;

  // Query Methods
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findMany(filter: FilterQuery<T>): Promise<T []>;
  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null>;

  // Pagination
  findWithPagination(
    filter?: FilterQuery<T>,
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
  ): Promise<T[]>;

  // Utility Methods
  count(filter?: FilterQuery<T>): Promise<number>;
}
