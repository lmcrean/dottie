import logger from '../../../../../../services/logger.js';

/**
 * Configuration helper for chat services
 * Centralizes configuration logic and provides standardized access
 */
export class ConfigHelper {
  
  /**
   * Get service configuration with defaults and validation
   * @param {string} serviceType - Service type ('ai' or 'mock')
   * @returns {Object} - Service configuration
   */
  static getServiceConfig(serviceType) {
    const baseConfig = {
      service: serviceType,
      timestamp: new Date().toISOString()
    };

    if (serviceType === 'ai') {
      return {
        ...baseConfig,
        model: this.getEnvString('GEMINI_MODEL', 'gemini-pro'),
        maxTokens: this.getEnvNumber('GEMINI_MAX_TOKENS', 1000, 1, 2048),
        temperature: this.getEnvNumber('GEMINI_TEMPERATURE', 0.7, 0, 2),
        safetySettings: this.getEnvString('GEMINI_SAFETY_LEVEL', 'default'),
        apiKey: this.getEnvString('GEMINI_API_KEY'),
        timeout: this.getEnvNumber('GEMINI_TIMEOUT', 30000, 1000, 60000)
      };
    } else {
      return {
        ...baseConfig,
        responseStyle: this.getEnvString('MOCK_RESPONSE_STYLE', 'helpful', ['helpful', 'casual', 'formal', 'technical']),
        useKeywordMatching: this.getEnvBoolean('MOCK_KEYWORD_MATCHING', true),
        responseVariety: this.getEnvString('MOCK_RESPONSE_VARIETY', 'medium', ['low', 'medium', 'high']),
        includeDevNotices: this.getEnvBoolean('MOCK_INCLUDE_DEV_NOTICES', true)
      };
    }
  }

  /**
   * Validate service configuration
   * @param {string} serviceType - Service type to validate
   * @returns {Object} - Validation result
   */
  static validateServiceConfig(serviceType) {
    const result = {
      isValid: false,
      errors: [],
      warnings: [],
      serviceType
    };

    try {
      if (!['ai', 'mock'].includes(serviceType)) {
        result.errors.push('Invalid service type. Must be "ai" or "mock"');
        return result;
      }

      if (serviceType === 'ai') {
        // AI service validation
        if (!process.env.GEMINI_API_KEY) {
          result.errors.push('GEMINI_API_KEY is required for AI service');
        }

        const maxTokens = this.getEnvNumber('GEMINI_MAX_TOKENS', 1000);
        if (maxTokens < 1 || maxTokens > 2048) {
          result.warnings.push('GEMINI_MAX_TOKENS should be between 1 and 2048');
        }

        const temperature = this.getEnvNumber('GEMINI_TEMPERATURE', 0.7);
        if (temperature < 0 || temperature > 2) {
          result.warnings.push('GEMINI_TEMPERATURE should be between 0 and 2');
        }
      } else {
        // Mock service validation (less strict)
        const responseStyle = process.env.MOCK_RESPONSE_STYLE;
        const validStyles = ['helpful', 'casual', 'formal', 'technical'];
        if (responseStyle && !validStyles.includes(responseStyle)) {
          result.warnings.push(`MOCK_RESPONSE_STYLE should be one of: ${validStyles.join(', ')}`);
        }
      }

      result.isValid = result.errors.length === 0;
      return result;

    } catch (error) {
      logger.error('Error validating service config:', error);
      result.errors.push(`Validation error: ${error.message}`);
      return result;
    }
  }

  /**
   * Get chat-specific configuration
   * @returns {Object} - Chat configuration
   */
  static getChatConfig() {
    return {
      messageMaxLength: this.getEnvNumber('CHAT_MESSAGE_MAX_LENGTH', 4000, 100, 10000),
      conversationHistoryLimit: this.getEnvNumber('CHAT_HISTORY_LIMIT', 50, 5, 200),
      autoResponseEnabled: this.getEnvBoolean('CHAT_AUTO_RESPONSE', true),
      typingDelay: this.getEnvNumber('CHAT_TYPING_DELAY', 1000, 0, 5000),
      maxConcurrentRequests: this.getEnvNumber('CHAT_MAX_CONCURRENT', 10, 1, 50)
    };
  }

  /**
   * Get database configuration for chat
   * @returns {Object} - Database configuration
   */
  static getDatabaseConfig() {
    return {
      messageRetentionDays: this.getEnvNumber('DB_MESSAGE_RETENTION_DAYS', 365, 30, 3650),
      batchSize: this.getEnvNumber('DB_BATCH_SIZE', 100, 10, 1000),
      queryTimeout: this.getEnvNumber('DB_QUERY_TIMEOUT', 30000, 1000, 120000),
      enableSoftDelete: this.getEnvBoolean('DB_ENABLE_SOFT_DELETE', true)
    };
  }

  // Private helper methods

  /**
   * Get environment variable as string with default and validation
   * @param {string} key - Environment variable key
   * @param {string} [defaultValue] - Default value
   * @param {Array} [allowedValues] - Array of allowed values for validation
   * @returns {string} - Environment variable value or default
   */
  static getEnvString(key, defaultValue = '', allowedValues = null) {
    const value = process.env[key] || defaultValue;
    
    if (allowedValues && !allowedValues.includes(value)) {
      logger.warn(`Invalid value for ${key}: ${value}. Using default: ${defaultValue}`);
      return defaultValue;
    }
    
    return value;
  }

  /**
   * Get environment variable as number with bounds checking
   * @param {string} key - Environment variable key
   * @param {number} defaultValue - Default value
   * @param {number} [min] - Minimum allowed value
   * @param {number} [max] - Maximum allowed value
   * @returns {number} - Environment variable value or default
   */
  static getEnvNumber(key, defaultValue, min = null, max = null) {
    const value = process.env[key];
    
    if (!value) return defaultValue;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      logger.warn(`Invalid number for ${key}: ${value}. Using default: ${defaultValue}`);
      return defaultValue;
    }
    
    if (min !== null && numValue < min) {
      logger.warn(`Value for ${key} below minimum: ${numValue} < ${min}. Using default: ${defaultValue}`);
      return defaultValue;
    }
    
    if (max !== null && numValue > max) {
      logger.warn(`Value for ${key} above maximum: ${numValue} > ${max}. Using default: ${defaultValue}`);
      return defaultValue;
    }
    
    return numValue;
  }

  /**
   * Get environment variable as boolean
   * @param {string} key - Environment variable key
   * @param {boolean} defaultValue - Default value
   * @returns {boolean} - Environment variable value or default
   */
  static getEnvBoolean(key, defaultValue) {
    const value = process.env[key];
    
    if (!value) return defaultValue;
    
    const lowerValue = value.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(lowerValue)) {
      return true;
    } else if (['false', '0', 'no', 'off'].includes(lowerValue)) {
      return false;
    }
    
    logger.warn(`Invalid boolean for ${key}: ${value}. Using default: ${defaultValue}`);
    return defaultValue;
  }

  /**
   * Get all configuration for logging/debugging
   * @returns {Object} - All configuration values
   */
  static getAllConfig() {
    return {
      serviceConfig: {
        ai: this.getServiceConfig('ai'),
        mock: this.getServiceConfig('mock')
      },
      chatConfig: this.getChatConfig(),
      databaseConfig: this.getDatabaseConfig(),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  }
} 