// Import all individual functions
import { findById } from './findById.ts';
import { findBy } from './findBy.ts';
import { create } from './create.ts';
import { update } from './update.ts';
import { deleteRecord } from './delete.ts';
import { getAll } from './getAll.ts';
import { getConversationsWithPreviews } from './getConversationsWithPreviews.ts';
import { createWithJson } from './createWithJson.ts';
import { findByIdWithJson } from './findByIdWithJson.ts';
import { findByFieldWithJson } from './findByFieldWithJson.ts';
import { updateWithJson } from './updateWithJson.ts';

/**
 * Database service for common operations
 * Maintains the same API as the original DbService class
 */
class DbService {
  static async findById(table, id) {
    return findById(table, id);
  }

  static async findBy(table, field, value) {
    return findBy(table, field, value);
  }

  static async create(table, data) {
    return create(table, data);
  }

  static async update(table, id, data) {
    return update(table, id, data);
  }

  static async delete(table, option) {
    return deleteRecord(table, option);
  }

  static async getAll(table) {
    return getAll(table);
  }

  static async getConversationsWithPreviews(userId) {
    return getConversationsWithPreviews(userId);
  }

  static async createWithJson(table, data, jsonFields = []) {
    return createWithJson(table, data, jsonFields);
  }

  static async findByIdWithJson(table, id, jsonFields = []) {
    return findByIdWithJson(table, id, jsonFields);
  }

  static async findByFieldWithJson(table, field, value, jsonFields = [], orderBy = null) {
    return findByFieldWithJson(table, field, value, jsonFields, orderBy);
  }

  static async updateWithJson(table, id, data, jsonFields = []) {
    return updateWithJson(table, id, data, jsonFields);
  }
}

// Export both the class and individual functions
export default DbService;
export {
  findById,
  findBy,
  create,
  update,
  deleteRecord as delete,
  getAll,
  getConversationsWithPreviews,
  createWithJson,
  findByIdWithJson,
  findByFieldWithJson,
  updateWithJson
}; 
