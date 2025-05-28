/**
 * Prepares assessment_id for chat testing
 * Locates an existing assessment_id from earlier test setup
 * Tests the codebase's ability to find assessment_object by assessment_id
 * Simulates frontend context where assessment_id is stored
 */

import { query } from '../../../../../../services/db-service/index.js';

export async function prepareAssessmentId() {
    try {
        // Find the most recent assessment for testing
        const result = await query(
            'SELECT id, assessment_object FROM assessments ORDER BY created_at DESC LIMIT 1'
        );

        if (result.rows.length === 0) {
            throw new Error('No assessments found for testing. Run assessment creation tests first.');
        }

        const assessment = result.rows[0];
        const assessmentId = assessment.id;
        const assessmentObject = assessment.assessment_object;

        // Validate that assessment has required data
        if (!assessmentObject) {
            throw new Error(`Assessment ${assessmentId} has null assessment_object`);
        }

        console.log(`✓ Found assessment_id: ${assessmentId}`);
        console.log(`✓ Assessment object exists: ${JSON.stringify(assessmentObject).substring(0, 100)}...`);

        return {
            assessment_id: assessmentId,
            assessment_object: assessmentObject,
            isValid: true
        };

    } catch (error) {
        console.error('❌ Failed to prepare assessment_id:', error.message);
        return {
            assessment_id: null,
            assessment_object: null,
            isValid: false,
            error: error.message
        };
    }
}

export async function validateAssessmentExists(assessmentId) {
    try {
        const result = await query(
            'SELECT id, assessment_object FROM assessments WHERE id = $1',
            [assessmentId]
        );

        if (result.rows.length === 0) {
            return {
                exists: false,
                error: `Assessment with id ${assessmentId} not found`
            };
        }

        const assessment = result.rows[0];
        return {
            exists: true,
            assessment_id: assessment.id,
            has_object: !!assessment.assessment_object,
            assessment_object: assessment.assessment_object
        };

    } catch (error) {
        return {
            exists: false,
            error: error.message
        };
    }
} 