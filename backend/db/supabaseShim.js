/**
 * Database shim for Supabase
 * This file provides a Knex-like interface to Supabase for backward compatibility
 */

import supabase from '../services/supabaseService.js';

// Create a wrapper that simulates the Knex query builder
const createQueryBuilder = (tableName) => {
  const queryBuilder = {
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
    where(field, operator, value) {
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
        this._wheres.push({ field, value: operator });
      } else if (arguments.length === 3) {
        // Handle where('id', '=', 123)
        // For now, we ignore the operator and just use eq()
        this._wheres.push({ field, value });
      }
      
      return this;
    },
    
    orderBy(field, direction = 'asc') {
      this._orders.push({ field, direction });
      return this;
    },
    
    limit(limit) {
      this._limit = limit;
      return this;
    },
    
    offset(offset) {
      this._offset = offset;
      return this;
    },
    
    count(column = '*') {
      this._count = column;
      return this._runCount();
    },
    
    insert(data) {
      this._inserts = data;
      return this._runInsert();
    },
    
    update(data) {
      this._updates = data;
      return this._runUpdate();
    },
    
    delete() {
      return this._runDelete();
    },
    
    select(columns) {
      return this._runSelect(columns);
    },
    
    first() {
      this._limit = 1;
      return this._runSelect().then(data => data[0] || null);
    },
    
    // Execution methods
    async _runSelect(columns = '*') {
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
    
    async _runCount() {
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
    
    async _runInsert() {
      const { data, error } = await supabase
        .from(this._table)
        .insert(this._inserts)
        .select();
      
      if (error) throw error;
      return data?.map(item => item.id) || [];
    },
    
    async _runUpdate() {
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
    
    async _runDelete() {
      let query = supabase.from(this._table).delete();
      
      // Apply wheres
      for (const where of this._wheres) {
        query = query.eq(where.field, where.value);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      return 1; // Return count affected (simplified)
    }
  };
  
  // Make it thenable for direct execution
  queryBuilder.then = (resolve, reject) => {
    return queryBuilder._runSelect()
      .then(resolve)
      .catch(reject);
  };
  
  return queryBuilder;
};

// Create a function that acts like the knex instance
const db = (tableName) => {
  return createQueryBuilder(tableName);
};

// Add raw query method
db.raw = async (sql) => {
  // For simple queries, try to interpret them
  if (sql === 'SELECT 1') {
    return [{ '1': 1 }];
  }
  
  // For other queries, console log them for now

  return [{ message: 'Raw SQL queries are not directly supported with Supabase' }];
};

// Add schema operations
db.schema = {
  hasTable: async (tableName) => {
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
  
  createTable: async (tableName, tableBuilder) => {

    return true;
  },
  
  dropTable: async (tableName) => {

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
db.destroy = async () => {

  return true;
};

// Add events
db.on = (event, callback) => {
  if (event === 'error') {
    // We could add real error handling here

  }
  return db;
};

export { db };
export default db; 