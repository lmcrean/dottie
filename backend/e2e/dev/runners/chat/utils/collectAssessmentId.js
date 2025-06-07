/**
 * Assessment ID Collection Utility
 * Handles assessment ID retrieval and validation for chat testing
 */

import { db } from '../../../../../db/index.js';

/**
 * Collect the most recent assessment ID for testing
 * @returns {Promise<Object>} Assessment collection result
 */
export async function collectAssessmentId() {
    try {
        const result = await db.raw(
            'SELECT id, assessment_object FROM assessments ORDER BY created_at DESC LIMIT 1'
        );

        if (result.length === 0) {
            throw new Error('No assessments found for testing. Run assessment creation tests first.');
        }

        const assessment = result[0];
        const assessmentId = assessment.id;
        const assessmentObject = assessment.assessment_object;

        if (!assessmentObject) {
            throw new Error(`Assessment ${assessmentId} has null assessment_object`);
        }

        console.log(`✓ Found assessment_id: ${assessmentId}`);
        
        return {
            assessment_id: assessmentId,
            assessment_object: assessmentObject,
            isValid: true
        };

    } catch (error) {
        console.error('❌ Failed to collect assessment_id:', error.message);
        return {
            assessment_id: null,
            assessment_object: null,
            isValid: false,
            error: error.message
        };
    }
}

/**
 * Validate assessment exists by ID
 * @param {string} assessmentId - Assessment ID to validate
 * @returns {Promise<Object>} Validation result
 */
export async function validateAssessmentExists(assessmentId) {
    try {
        const result = await db.raw(
            'SELECT id, assessment_object FROM assessments WHERE id = ?',
            [assessmentId]
        );

        if (result.length === 0) {
            return {
                exists: false,
                error: `Assessment with id ${assessmentId} not found`
            };
        }

        const assessment = result[0];
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
