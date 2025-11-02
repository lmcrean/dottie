/**
 * Type definitions for the Assessment domain
 */

// ============================================================================
// Database Types
// ============================================================================

/**
 * Assessment record as stored in the database
 */
export interface AssessmentDbRecord {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  age: string;
  pattern: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  physical_symptoms: string | null; // JSON array stored as text
  emotional_symptoms: string | null; // JSON array stored as text
  other_symptoms: string | null; // JSON array stored as text
  recommendations: string | null; // JSON array stored as text
  assessment_data?: string | null; // Legacy field for backwards compatibility
}

// ============================================================================
// API Types
// ============================================================================

/**
 * Recommendation with title and description
 */
export interface Recommendation {
  title: string;
  description: string;
}

/**
 * Assessment data as received from API (input)
 */
export interface AssessmentApiInput {
  age: string;
  pattern: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  physical_symptoms?: string[];
  emotional_symptoms?: string[];
  other_symptoms?: string | string[];
  recommendations?: Recommendation[] | string[];
}

/**
 * Assessment data as returned by API (output/response)
 */
export interface AssessmentApiResponse {
  id: string;
  user_id: string;
  created_at: string;
  age: string;
  pattern: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  other_symptoms: string[];
  recommendations: Recommendation[];
}

/**
 * Partial assessment data for updates
 */
export type AssessmentUpdateInput = Partial<AssessmentApiInput>;

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================================
// Transformer Types
// ============================================================================

/**
 * Database payload for creating/updating assessments
 */
export interface AssessmentDbPayload {
  age: string;
  pattern: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  physical_symptoms: string | null;
  emotional_symptoms: string | null;
  other_symptoms: string | null;
  recommendations: string | null;
}

/**
 * Complete payload for database insertion (with metadata)
 */
export interface AssessmentCreatePayload extends AssessmentDbPayload {
  id: string;
  user_id: string;
  created_at: Date;
}

// ============================================================================
// Service Types
// ============================================================================

/**
 * Result type for operations that can be null
 */
export type AssessmentResult = AssessmentApiResponse | null;

/**
 * Result type for list operations
 */
export type AssessmentListResult = AssessmentApiResponse[];

/**
 * Transformer function type for custom transformations
 */
export type TransformerFunction = (record: AssessmentDbRecord) => AssessmentApiResponse | null;

/**
 * Record processor function type for validation
 */
export type RecordProcessorFunction = (record: AssessmentDbRecord) => boolean;
