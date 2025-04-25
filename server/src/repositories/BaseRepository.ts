// repositories/BaseRepository.ts
import { Model, Document, FilterQuery, UpdateQuery, LeanDocument } from 'mongoose';
import { IBaseRepository } from '../core/interfaces/repositories/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
 // Helper type for lean documents
 private toLeanDoc(doc: any): LeanDocument<T> {
  return doc as unknown as LeanDocument<T>;
}
  async findAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      this.handleError(error, 'Failed to fetch all documents');
    }
  }

  async create(item: Partial<T>): Promise<T> {
    try {
      const document = new this.model(item);
      return await document.save();
    } catch (error) {
      this.handleError(error, 'Failed to create document');
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      this.handleError(error, `Failed to find document by ID: ${id}`);
    }
  }


  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        update,
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      this.handleError(error, `Failed to update document: ${id}`);
    }
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: { new?: boolean; upsert?: boolean }
  ): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
          runValidators: true,
          ...options
        }
      ).exec();
    } catch (error) {
      this.handleError(error, 'Failed to find and update document');
    }
  }

  async findMany(filter: FilterQuery<T>):Promise<T[]>{
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      this.handleError(error, 'Failed to find document');
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      this.handleError(error, 'Failed to find document');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      this.handleError(error, `Failed to delete document: ${id}`);
    }
  }

  async findWithPagination(
    filter: FilterQuery<T> = {},
    skip: number = 0,
    limit: number = 10,
    sort?: Record<string, 1 | -1>
  ): Promise<T[]> {
    try {
      let query = this.model.find(filter).skip(skip).limit(limit);
      if (sort) {
        query = query.sort(sort);
      }
      return await query.exec();
    } catch (error) {
      this.handleError(error, 'Failed to fetch paginated documents');
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    console.log(filter);
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      this.handleError(error, 'Failed to count documents');
    }
  }

  
  protected handleError(error: unknown, message: string): never {
    console.error(`${message}:`, error);
    throw new Error(message);
  }
  protected transformToObject(doc: LeanDocument<T> | null): T | null {
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc)) as T;
  }

  protected transformAllToObjects(docs: LeanDocument<T>[]): T[] {
    return docs.map(doc => this.transformToObject(doc)!);
  }

}
