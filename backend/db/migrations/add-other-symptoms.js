/**
 * Migration to add other_symptoms column to assessments table
 */

/**
 * Add the other_symptoms column to assessments table if it doesn't exist
 * @param {object} knex - Knex instance
 * @returns {Promise} Promise resolving to migration result
 */
export async function up(knex) {
  try {
    // Check if the assessments table exists
    const hasTable = await knex.schema.hasTable('assessments');
    if (!hasTable) {
      return;
    }

    // Check if the other_symptoms column already exists
    const hasColumn = await knex.schema.hasColumn('assessments', 'other_symptoms');
    if (hasColumn) {
      return;
    }

    // Add the other_symptoms column to the assessments table
    return knex.schema.table('assessments', (table) => {
      table.text('other_symptoms');
    });
  } catch (error) {
    console.error('Error adding other_symptoms column:', error);
    throw error;
  }
}

/**
 * Rollback migration
 * @param {object} knex - Knex instance
 * @returns {Promise} Promise resolving to rollback result
 */
export async function down(knex) {
  return knex.schema.table('assessments', (table) => {
    table.dropColumn('other_symptoms');
  });
} 