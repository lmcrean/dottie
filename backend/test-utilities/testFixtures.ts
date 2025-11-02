// Provide fixtures for tests to ensure consistent test data

import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Generate test user data
 * @param {Object} overrides - Override default properties
 * @returns {Object} Test user object
 */
export function generateUser(overrides = {}) {
  const timestamp = Date.now();
  const id = overrides.id || `test-${timestamp}`;
  return {
    id,
    username: overrides.username || `testuser_${timestamp}`,
    email: overrides.email || `test_${timestamp}@example.com`,
    password_hash: overrides.password_hash || bcrypt.hashSync('TestPassword123!', 10),
    age: overrides.age || '25_34',
    created_at: overrides.created_at || new Date(),
    updated_at: overrides.updated_at || new Date()
  };
}

/**
 * Generate test period log data
 * @param {Object} overrides - Override default properties
 * @returns {Object} Test period log
 */
export function generatePeriodLog(overrides = {}) {
  const timestamp = Date.now();
  return {
    id: overrides.id || timestamp,
    user_id: overrides.user_id || `test-${timestamp}`,
    start_date: overrides.start_date || new Date(),
    end_date: overrides.end_date || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    flow_level: overrides.flow_level || 3,
    created_at: overrides.created_at || new Date(),
    updated_at: overrides.updated_at || new Date()
  };
}

/**
 * Generate test symptom data
 * @param {Object} overrides - Override default properties
 * @returns {Object} Test symptom
 */
export function generateSymptom(overrides = {}) {
  const timestamp = Date.now();
  return {
    id: overrides.id || timestamp,
    user_id: overrides.user_id || `test-${timestamp}`,
    date: overrides.date || new Date(),
    type: overrides.type || 'cramps',
    severity: overrides.severity || 3,
    notes: overrides.notes || 'Test symptom notes',
    created_at: overrides.created_at || new Date(),
    updated_at: overrides.updated_at || new Date()
  };
}

/**
 * Generate a test assessment
 * @param {Object} overrides - Override default properties
 * @returns {Object} Test assessment
 */
export function generateAssessment(overrides = {}) {
  const timestamp = Date.now();
  return {
    id: overrides.id || timestamp,
    user_id: overrides.user_id || `test-${timestamp}`,
    date: overrides.date || new Date(),
    result_category: overrides.result_category || 'green',
    recommendations: overrides.recommendations || 'Test recommendations',
    created_at: overrides.created_at || new Date(),
    updated_at: overrides.updated_at || new Date()
  };
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `test-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
} 