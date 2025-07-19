/**
 * Prepares assessment_id for chat testing
 * Uses centralized utility functions for assessment collection
 */

import { 
    collectAssessmentId, 
    validateAssessmentExists 
} from './utils/collectAssessmentId.js';

// Alias for backward compatibility
export async function prepareAssessmentId() {
    return await collectAssessmentId();
}

// Re-export utility function for backward compatibility
export { validateAssessmentExists }; 