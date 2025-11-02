/**
 * Database shim for Supabase
 * This file provides a Knex-like interface to Supabase for backward compatibility
 */

import supabase from '../services/supabaseService.js';

interface WhereCondition {
  field: string;
  value: any;
}

interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

interface QueryBuilder {
  _table: string;
  _wheres: WhereCondition[];
  _orders: OrderBy[];
  _limit: number | null;
  _offset: number | null;
  _inserts: any | null;
  _updates: any | null;
  _count: string | null;
  where(field: string | object, operator?: any, value?: any): QueryBuilder;
  orderBy(field: string, direction?: 'asc' | 'desc'): QueryBuilder;
  limit(limit: number): QueryBuilder;
  offset(offset: number): QueryBuilder;
  count(column?: string): Promise<{ count: number }>;
  insert(data: any): Promise<any[]>;
  update(data: any): Promise<any[]>;
  delete(): Promise<number>;
  select(columns?: string): Promise<any[]>;
  first(): Promise<any | null>;
  then(resolve: (value: any) => void, reject?: (reason?: any) => void): Promise<any>;
  _runSelect(columns?: string): Promise<any[]>;
  _runCount(): Promise<{ count: number }>;
  _runInsert(): Promise<any[]>;
  _runUpdate(): Promise<any[]>;
  _runDelete(): Promise<number>;
}

// Create a wrapper that simulates the Knex query builder
const createQueryBuilder = (tableName: string): QueryBuilder => {
  const queryBuilder: QueryBuilder = {
    // State
    _table: tableName,
    _wheres: [],
    _orders: [],
    _limit: null,
    _offset: null,
    _inserts: null,
    _updates: null,
    _count: null,

    // Methods
    where(field: string | object, operator?: any, value?: any): QueryBuilder {
      // Handle different ways where() can be called:
      // 1. where('id', 123) - field and value
      // 2. where('id', '=', 123) - field, operator, value
      // 3. where({ id: 123 }) - object with field:value pairs

      if (arguments.length === 1 && typeof field === 'object') {
        // Handle object syntax: where({ id: 123 })
        const whereObj = field;
        Object.entries(whereObj).forEach(([key, val]) => {
          this._wheres.push({ field: key, value: val });
        });
      } else if (arguments.length === 2) {
        // Handle where('id', 123)
        this._wheres.push({ field: field as string, value: operator });
      } else if (arguments.length === 3) {
        // Handle where('id', '=', 123)
        // For now, we ignore the operator and just use eq()
        this._wheres.push({ field: field as string, value });
      }

      return this;
    },

    orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
      this._orders.push({ field, direction });
      return this;
    },

    limit(limit: number): QueryBuilder {
      this._limit = limit;
      return this;
    },

    offset(offset: number): QueryBuilder {
      this._offset = offset;
      return this;
    },

    count(column: string = '*'): Promise<{ count: number }> {
      this._count = column;
      return this._runCount();
    },

    insert(data: any): Promise<any[]> {
      this._inserts = data;
      return this._runInsert();
    },

    update(data: any): Promise<any[]> {
      this._updates = data;
      return this._runUpdate();
    },

    delete(): Promise<number> {
      return this._runDelete();
    },

    select(columns?: string): Promise<any[]> {
      return this._runSelect(columns);
    },

    first(): Promise<any | null> {
      this._limit = 1;
      return this._runSelect().then(data => data[0] || null);
    },

    // Execution methods
    async _runSelect(columns: string = '*'): Promise<any[]> {
      let query = supabase.from(this._table).select(columns);

      // Apply wheres
      for (const where of this._wheres) {
        query = query.eq(where.field, where.value);
      }

      // Apply ordering
      if (this._orders.length > 0) {
        const { field, direction } = this._orders[0];
        query = query.order(field, { ascending: direction === 'asc' });
      }

      // Apply limit and offset
      if (this._limit !== null) {
        query = query.limit(this._limit);
      }

      if (this._offset !== null) {
        query = query.range(this._offset, this._offset + (this._limit || 1000) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },

    async _runCount(): Promise<{ count: number }> {
      let query = supabase.from(this._table).select('*', { count: 'exact', head: true });

      // Apply wheres
      for (const where of this._wheres) {
        query = query.eq(where.field, where.value);
      }

      const { count, error } = await query;

      if (error) throw error;

      // Return in the format expected by Knex.js count queries
      return { count: count || 0 };
    },

    async _runInsert(): Promise<any[]> {
      const { data, error } = await supabase
        .from(this._table)
        .insert(this._inserts)
        .select();

      if (error) throw error;
      return data?.map(item => item.id) || [];
    },

    async _runUpdate(): Promise<any[]> {
      console.log(`[Supabase] Update operation starting for table: ${this._table}`);
      console.log(`[Supabase] Update data:`, JSON.stringify(this._updates));
      console.log(`[Supabase] Where conditions:`, JSON.stringify(this._wheres));

      let query = supabase.from(this._table).update(this._updates);

      // Apply wheres
      for (const where of this._wheres) {
        // Fix: Make sure we're using the correct property access
        const fieldName = typeof where.field === 'string' ? where.field : Object.keys(where.field)[0];
        const fieldValue = typeof where.field === 'string' ? where.value : where.field[fieldName];

        console.log(`[Supabase] Adding where condition: ${fieldName} = ${fieldValue}`);

        // Make sure both field and value are properly defined
        if (fieldName && fieldValue !== undefined) {
          query = query.eq(fieldName, fieldValue);
        } else {
          console.warn(`[Supabase] Skipping invalid where condition: ${JSON.stringify(where)}`);
        }
      }

      // Add select() to return the updated data
      console.log(`[Supabase] Executing update query on table: ${this._table} with select`);
      const { data, error } = await query.select();

      if (error) {
        console.error(`[Supabase] Error updating table ${this._table}:`, error);
        throw error;
      }

      console.log(`[Supabase] Update result:`, data ? `Success, affected ${data.length} rows` : 'No data returned');
      console.log(`[Supabase] Updated data:`, JSON.stringify(data));
      return data || []; // Return the updated data or empty array
    },

    async _runDelete(): Promise<number> {
      let query = supabase.from(this._table).delete();

      // Apply wheres
      for (const where of this._wheres) {
        query = query.eq(where.field, where.value);
      }

      const { error } = await query;

      if (error) throw error;
      return 1; // Return count affected (simplified)
    },

    // Make it thenable for direct execution
    then(resolve: (value: any) => void, reject?: (reason?: any) => void): Promise<any> {
      return this._runSelect()
        .then(resolve)
        .catch(reject);
    }
  };

  return queryBuilder;
};

interface DbFunction {
  (tableName: string): QueryBuilder;
  raw: (sql: string) => Promise<any[]>;
  schema: {
    hasTable: (tableName: string) => Promise<boolean>;
    createTable: (tableName: string, tableBuilder?: any) => Promise<boolean>;
    dropTable: (tableName: string) => Promise<boolean>;
  };
  client: {
    config: {
      client: string;
    };
  };
  destroy: () => Promise<boolean>;
  on: (event: string, callback: Function) => DbFunction;
}

// Create a function that acts like the knex instance
const db = ((tableName: string): QueryBuilder => {
  return createQueryBuilder(tableName);
}) as DbFunction;

// Add raw query method
db.raw = async (sql: string): Promise<any[]> => {
  // For simple queries, try to interpret them
  if (sql === 'SELECT 1') {
    return [{ '1': 1 }];
  }

  // For other queries, console log them for now
  return [{ message: 'Raw SQL queries are not directly supported with Supabase' }];
};

// Add schema operations
db.schema = {
  hasTable: async (tableName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  },

  createTable: async (tableName: string, tableBuilder?: any): Promise<boolean> => {
    return true;
  },

  dropTable: async (tableName: string): Promise<boolean> => {
    return true;
  }
};

// Add client info for compatibility
db.client = {
  config: {
    client: 'supabase'
  }
};

// Database cleanup
db.destroy = async (): Promise<boolean> => {
  return true;
};

// Add events
db.on = (event: string, callback: Function): DbFunction => {
  if (event === 'error') {
    // We could add real error handling here
  }
  return db;
};

export { db };
export default db;
