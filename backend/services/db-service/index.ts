// Import all individual functions
import { findById } from './findById.js';
import { findBy } from './findBy.js';
import { findWhere } from './findWhere.js';
import { exists } from './exists.js';
import { create } from './create.js';
import { update } from './update.js';
import { deleteRecord } from './delete.js';
import { getAll } from './getAll.js';
import { getConversationsWithPreviews } from './getConversationsWithPreviews.js';
import { createWithJson } from './createWithJson.js';
import { findByIdWithJson } from './findByIdWithJson.js';
import { findByFieldWithJson } from './findByFieldWithJson.js';
import { updateWithJson } from './updateWithJson.js';
import { updateWhere } from './updateWhere.js';
import type {
  DbRecord,
  PartialDbRecord,
  WhereCondition,
  QueryOptions,
  DeleteOption,
  ConversationPreview,
  IDbService
} from './types.js';

/**
 * Database service for common operations
 * Maintains the same API as the original DbService class
 */
class DbService {
  static async findById<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number
  ): Promise<T | null> {
    return findById<T>(table, id);
  }

  static async findBy<T extends DbRecord = DbRecord>(
    table: string,
    field: string,
    value: any
  ): Promise<T[]> {
    return findBy<T>(table, field, value);
  }

  static async findWhere<T extends DbRecord = DbRecord>(
    table: string,
    whereCondition: WhereCondition,
    options: QueryOptions = {}
  ): Promise<T[]> {
    return findWhere<T>(table, whereCondition, options);
  }

  static async exists(table: string, id: string | number): Promise<boolean> {
    return exists(table, id);
  }

  static async create<T extends DbRecord = DbRecord>(
    table: string,
    data: PartialDbRecord
  ): Promise<T> {
    return create<T>(table, data);
  }

  static async update<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    data: PartialDbRecord
  ): Promise<T> {
    return update<T>(table, id, data);
  }

  static async delete(table: string, option: DeleteOption): Promise<boolean> {
    return deleteRecord(table, option);
  }

  static async getAll<T extends DbRecord = DbRecord>(table: string): Promise<T[]> {
    return getAll<T>(table);
  }

  static async getConversationsWithPreviews(
    userId: string | number
  ): Promise<ConversationPreview[]> {
    return getConversationsWithPreviews(userId);
  }

  static async createWithJson<T extends DbRecord = DbRecord>(
    table: string,
    data: PartialDbRecord,
    jsonFields: string[] = []
  ): Promise<T> {
    return createWithJson<T>(table, data, jsonFields);
  }

  static async findByIdWithJson<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    jsonFields: string[] = []
  ): Promise<T | null> {
    return findByIdWithJson<T>(table, id, jsonFields);
  }

  static async findByFieldWithJson<T extends DbRecord = DbRecord>(
    table: string,
    field: string,
    value: any,
    jsonFields: string[] = [],
    orderBy: string | { field: string; direction?: 'asc' | 'desc' } | Array<{ field: string; direction?: 'asc' | 'desc' }> | null = null
  ): Promise<T[]> {
    return findByFieldWithJson<T>(table, field, value, jsonFields, orderBy);
  }

  static async updateWithJson<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    data: PartialDbRecord,
    jsonFields: string[] = []
  ): Promise<T> {
    return updateWithJson<T>(table, id, data, jsonFields);
  }

  static async updateWhere(
    table: string,
    whereCondition: WhereCondition,
    updateData: PartialDbRecord
  ): Promise<number> {
    return updateWhere(table, whereCondition, updateData);
  }
}

// Export both the class and individual functions
export default DbService;
export {
  findById,
  findBy,
  findWhere,
  exists,
  create,
  update,
  deleteRecord as delete,
  getAll,
  getConversationsWithPreviews,
  createWithJson,
  findByIdWithJson,
  findByFieldWithJson,
  updateWithJson,
  updateWhere
};

// Export types
export type {
  DbRecord,
  PartialDbRecord,
  WhereCondition,
  QueryOptions,
  DeleteOption,
  ConversationPreview,
  IDbService
};
