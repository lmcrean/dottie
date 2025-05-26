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

      return;
    }

    // Check if the other_symptoms column already exists
    const hasColumn = await db.schema.hasColumn('assessments', 'other_symptoms');
    if (hasColumn) {

      return;
    }

    // Add the other_symptoms column to the assessments table
    await db.schema.table('assessments', (table) => {
      table.text('other_symptoms');
    });
    

  } catch (error) {
    console.error('Error adding other_symptoms column:', error);
    throw error;
  }
}

export default addOtherSymptomsColumn; 
