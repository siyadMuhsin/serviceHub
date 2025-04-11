// repositories/BaseRepository.ts
import { Model, Document, LeanDocument, FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../core/interfaces/repositories/IBaseRepository';
import { IUser } from '../models/user.model';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Helper type for lean documents
  private toLeanDoc(doc: any): LeanDocument<T> {
    return doc as unknown as LeanDocument<T>;
  }

  async findAll(): Promise<LeanDocument<T>[]> {
    try {
      const docs = await this.model.find().lean().exec();
      return docs.map(this.toLeanDoc);
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

  async findById(id: string): Promise<LeanDocument<T> | null> {
    try {
      const doc = await this.model.findById(id).lean().exec();
      return doc ? this.toLeanDoc(doc) : null;
    } catch (error) {
      this.handleError(error, `Failed to find document by ID: ${id}`);
    }
  }


  async updateById(id: string, update: Partial<T>): Promise<LeanDocument<T> | null> {
    try {
      const doc = await this.model.findByIdAndUpdate(
        id, 
        update, 
        { new: true, runValidators: true }
      ).lean().exec();
      return doc ? this.toLeanDoc(doc) : null;
    } catch (error) {
      this.handleError(error, `Failed to update document: ${id}`);
    }
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: { new?: boolean; upsert?: boolean }
  ): Promise<LeanDocument<T> | null> {
    try {
      const doc = await this.model.findOneAndUpdate(
        filter,
        update,
        { 
          new: true,
          runValidators: true,
          ...options 
        }
      ).lean().exec();
      return doc ? this.toLeanDoc(doc) : null;
    } catch (error) {
      this.handleError(error, 'Failed to find and update document');
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<LeanDocument<T> | null> {
    try {
      const doc = await this.model.findOne(filter).lean().exec();
      return doc ? this.toLeanDoc(doc) : null;
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
  ): Promise<LeanDocument<T>[]> {
    try {
      let query = this.model.find(filter)
        .skip(skip)
        .limit(limit);
      
      if (sort) {
        query = query.sort(sort);
      }

      const docs = await query.lean().exec();
      return docs.map(this.toLeanDoc);
    } catch (error) {
      this.handleError(error, 'Failed to fetch paginated documents');
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      this.handleError(error, 'Failed to count documents');
    }
  }


  protected transformToObject(doc: LeanDocument<T> | null): T | null {
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc)) as T;
  }
  protected handleError(error: unknown, message: string): never {
    console.error(`${message}:`, error);
    throw new Error(message);
  }
  protected transformAllToObjects(docs: LeanDocument<T>[]): T[] {
    return docs.map(doc => this.transformToObject(doc)!);
  }
}