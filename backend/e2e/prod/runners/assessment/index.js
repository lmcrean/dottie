/**
 * Assessment Module Index
 * 
 * Exports all assessment-related endpoint runners.
 */

export { createAssessment } from './create-assessment.js';
export { getAssessments } from './get-assessments.js';
export { getAssessmentById } from './get-assessment-by-id.js';
export { updateAssessment } from './update-assessment.js';
export { deleteAssessment } from './delete-assessment.js';
export { generateDefaultAssessment, generateSevereAssessment } from './test-data-generators.js'; 