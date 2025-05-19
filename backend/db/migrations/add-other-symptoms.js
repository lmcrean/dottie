/**
 * Migration to add other_symptoms column to assessments table
 */

/**
 * Add the other_symptoms column to assessments table if it doesn't exist
 * @param {object} db - Knex database instance
 */
export async function addOtherSymptomsColumn(db) {
  try {
    // Check if the assessments table exists
    const hasTable = await db.schema.hasTable('assessments');
    if (!hasTable) {
      console.log('Assessments table does not exist. No migration needed.');
      return;
    }

    // Check if the other_symptoms column already exists
    const hasColumn = await db.schema.hasColumn('assessments', 'other_symptoms');
    if (hasColumn) {
      console.log('other_symptoms column already exists. No migration needed.');
      return;
    }

    // Add the other_symptoms column to the assessments table
    await db.schema.table('assessments', (table) => {
      table.text('other_symptoms');
    });
    
    console.log('Successfully added other_symptoms column to assessments table.');
  } catch (error) {
    console.error('Error adding other_symptoms column:', error);
    throw error;
  }
}

export default addOtherSymptomsColumn; 