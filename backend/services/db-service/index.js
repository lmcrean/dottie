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

  static async findWhere(table, whereCondition, options = {}) {
    return findWhere(table, whereCondition, options);
  }

  static async exists(table, id) {
    return exists(table, id);
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

  static async updateWhere(table, whereCondition, updateData) {
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