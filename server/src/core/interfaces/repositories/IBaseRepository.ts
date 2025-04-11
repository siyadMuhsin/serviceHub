// core/interfaces/repositories/IBaseRepository.ts
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T> {
  // CRUD Operations
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<LeanDocument<T> | null>;
  findAll(): Promise<LeanDocument<T>[]>;
  updateById(id: string, item: Partial<T>): Promise<LeanDocument<T> | null>;
  delete(id: string): Promise<boolean>;

  // Query Methods
  findOne(filter: FilterQuery<T>): Promise<LeanDocument<T> | null>;
  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<LeanDocument<T> | null>;

  // Pagination
  findWithPagination(
    filter?: FilterQuery<T>,
    skip?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
  ): Promise<LeanDocument<T>[]>;

  // Utility Methods
  count(filter?: FilterQuery<T>): Promise<number>;

  // Note: The actual error handling is implementation-specific
  // so it's not included in the interface
}