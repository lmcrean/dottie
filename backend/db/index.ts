/**
 * Database entry point
 * This file selects the appropriate database implementation based on the environment
 */

import { db, dbType } from './database.ts';

export { db, dbType };
export default db; 
