import DetectAssessmentFormat from './DetectAssessmentFormat.ts';

/**
 * FormatDetector - Alias for DetectAssessmentFormat
 * Provides the same functionality with different naming for backward compatibility
 */
class FormatDetector {
  /**
   * Check if assessment is in current format
   * @param {Object} assessment - Assessment object to check
   * @returns {boolean} True if in current format
   */
  static isCurrentFormat(assessment) {
    return DetectAssessmentFormat.isCurrentFormat(assessment);
  }

  /**
   * Check if assessment is in legacy format
   * @param {Object} assessment - Assessment object to check
   * @returns {boolean} True if in legacy format
   */
  static isLegacyFormat(assessment) {
    return DetectAssessmentFormat.isLegacyFormat(assessment);
  }

  /**
   * Detect the format of assessment data
   * @param {Object} assessmentData - Assessment data to analyze
   * @returns {string} Format type ('current' or 'legacy')
   */
  static detectDataFormat(assessmentData) {
    return DetectAssessmentFormat.detectDataFormat(assessmentData);
  }
}

export default FormatDetector; 