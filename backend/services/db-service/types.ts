/**
 * Type definitions for database service
 */

/**
 * Database record with at least an ID field
 */
export interface DbRecord {
  id: string | number;
  [key: string]: any;
}

/**
 * Partial database record for creates/updates
 */
export type PartialDbRecord = Partial<DbRecord>;

/**
 * Operator value for where conditions
 */
export type OperatorValue<T = any> = {
  '<'?: T;
  '>'?: T;
  '<='?: T;
  '>='?: T;
  '!='?: T;
  'in'?: T[];
  'not in'?: T[];
  'like'?: string;
};

/**
 * Where condition - supports both direct values and operator objects
 */
export type WhereCondition = {
  [key: string]: any | OperatorValue;
};

/**
 * Sort order direction
 */
export type SortOrder = 'asc' | 'desc' | 'ASC' | 'DESC';

/**
 * Query options for findWhere and similar operations
 */
export interface QueryOptions {
  orderBy?: string;
  order?: SortOrder;
  limit?: number;
  offset?: number;
}

/**
 * Conversation preview type for getConversationsWithPreviews
 */
export interface ConversationPreview {
  id: string | number;
  last_message_date: Date | string;
  preview: string;
  message_count: number;
  assessment_id?: string | number | null;
  assessment_pattern?: string | null;
  user_id: string | number;
}

/**
 * Delete options - can be ID or where condition
 */
export type DeleteOption = string | number | WhereCondition;

/**
 * Generic database service interface
 * Provides type-safe database operations
 */
export interface IDbService {
  /**
   * Find a record by ID
   */
  findById<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number
  ): Promise<T | null>;

  /**
   * Find records by field value
   */
  findBy<T extends DbRecord = DbRecord>(
    table: string,
    field: string,
    value: any
  ): Promise<T[]>;

  /**
   * Find records based on where condition
   */
  findWhere<T extends DbRecord = DbRecord>(
    table: string,
    whereCondition: WhereCondition,
    options?: QueryOptions
  ): Promise<T[]>;

  /**
   * Check if a record exists by ID
   */
  exists(table: string, id: string | number): Promise<boolean>;

  /**
   * Create a new record
   */
  create<T extends DbRecord = DbRecord>(
    table: string,
    data: PartialDbRecord
  ): Promise<T>;

  /**
   * Update a record by ID
   */
  update<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    data: PartialDbRecord
  ): Promise<T>;

  /**
   * Delete a record
   */
  delete(table: string, option: DeleteOption): Promise<boolean>;

  /**
   * Get all records from a table
   */
  getAll<T extends DbRecord = DbRecord>(table: string): Promise<T[]>;

  /**
   * Get conversations with message previews
   */
  getConversationsWithPreviews(
    userId: string | number
  ): Promise<ConversationPreview[]>;

  /**
   * Create a record with JSON fields auto-stringified
   */
  createWithJson<T extends DbRecord = DbRecord>(
    table: string,
    data: PartialDbRecord,
    jsonFields?: string[]
  ): Promise<T>;

  /**
   * Find a record by ID with JSON fields auto-parsed
   */
  findByIdWithJson<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    jsonFields?: string[]
  ): Promise<T | null>;

  /**
   * Find records by field with JSON fields auto-parsed
   */
  findByFieldWithJson<T extends DbRecord = DbRecord>(
    table: string,
    field: string,
    value: any,
    jsonFields?: string[],
    orderBy?: string | null
  ): Promise<T[]>;

  /**
   * Update a record with JSON fields auto-stringified
   */
  updateWithJson<T extends DbRecord = DbRecord>(
    table: string,
    id: string | number,
    data: PartialDbRecord,
    jsonFields?: string[]
  ): Promise<T>;

  /**
   * Update records based on where condition
   */
  updateWhere(
    table: string,
    whereCondition: WhereCondition,
    updateData: PartialDbRecord
  ): Promise<number>;
}
