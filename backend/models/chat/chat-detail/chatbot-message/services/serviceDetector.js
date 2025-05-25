import logger from '../../../../../services/logger.js';

/**
 * Detect which service should be used for generating responses
 * @returns {Promise<string>} - 'ai' or 'mock'
 */
export const detectService = async () => {
  try {
    // Check environment variables first
    const forceMode = process.env.CHAT_SERVICE_MODE?.toLowerCase();
    if (forceMode === 'mock' || forceMode === 'ai') {
      logger.info(`Service mode forced via environment: ${forceMode}`);
      return forceMode;
    }

    // Check if AI service is available
    const isAiAvailable = await checkAIServiceAvailability();
    
    if (isAiAvailable) {
      logger.info('AI service detected as available');
      return 'ai';
    } else {
      logger.info('AI service not available, falling back to mock');
      return 'mock';
    }

  } catch (error) {
    logger.error('Error detecting service, defaulting to mock:', error);
    return 'mock';
  }
};

/**
 * Check if AI service is available and configured
 * @returns {Promise<boolean>} - True if AI service is available
 */
export const checkAIServiceAvailability = async () => {
  try {
    // Check for required environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      logger.warn('GEMINI_API_KEY not found in environment');
      return false;
    }

    // Try to load the AI service
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      
      // Test basic connectivity (if needed)
      // This is optional - you might want to skip this for performance
      // await genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      return true;
    } catch (importError) {
      logger.warn('AI service dependencies not available:', importError.message);
      return false;
    }

  } catch (error) {
    logger.error('Error checking AI service availability:', error);
    return false;
  }
};

/**
 * Get service configuration based on detected service
 * @returns {Promise<Object>} - Service configuration
 */
export const getServiceConfig = async () => {
  try {
    const serviceType = await detectService();
    
    const baseConfig = {
      service: serviceType,
      timestamp: new Date().toISOString()
    };

    if (serviceType === 'ai') {
      return {
        ...baseConfig,
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '1000'),
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
        safetySettings: process.env.GEMINI_SAFETY_LEVEL || 'default'
      };
    } else {
      return {
        ...baseConfig,
        responseStyle: process.env.MOCK_RESPONSE_STYLE || 'helpful',
        useKeywordMatching: process.env.MOCK_KEYWORD_MATCHING !== 'false',
        responseVariety: process.env.MOCK_RESPONSE_VARIETY || 'medium'
      };
    }

  } catch (error) {
    logger.error('Error getting service config:', error);
    return {
      service: 'mock',
      error: 'Failed to get service config',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Force service mode (useful for testing)
 * @param {string} mode - 'ai' or 'mock'
 * @returns {boolean} - Success status
 */
export const forceServiceMode = (mode) => {
  try {
    if (mode !== 'ai' && mode !== 'mock') {
      throw new Error('Invalid service mode. Must be "ai" or "mock"');
    }

    process.env.CHAT_SERVICE_MODE = mode;
    logger.info(`Service mode forced to: ${mode}`);
    return true;

  } catch (error) {
    logger.error('Error forcing service mode:', error);
    return false;
  }
};

/**
 * Reset service mode to auto-detection
 * @returns {boolean} - Success status
 */
export const resetServiceMode = () => {
  try {
    delete process.env.CHAT_SERVICE_MODE;
    logger.info('Service mode reset to auto-detection');
    return true;
  } catch (error) {
    logger.error('Error resetting service mode:', error);
    return false;
  }
};

/**
 * Get current service status information
 * @returns {Promise<Object>} - Service status
 */
export const getServiceStatus = async () => {
  try {
    const currentService = await detectService();
    const config = await getServiceConfig();
    const aiAvailable = await checkAIServiceAvailability();

    return {
      currentService,
      aiServiceAvailable: aiAvailable,
      isForced: !!process.env.CHAT_SERVICE_MODE,
      forcedMode: process.env.CHAT_SERVICE_MODE || null,
      config,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error getting service status:', error);
    return {
      currentService: 'mock',
      aiServiceAvailable: false,
      isForced: false,
      forcedMode: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Validate service configuration
 * @param {string} serviceType - Service type to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateServiceConfig = async (serviceType) => {
  const result = {
    isValid: false,
    errors: [],
    warnings: []
  };

  try {
    if (serviceType === 'ai') {
      // Validate AI configuration
      if (!process.env.GEMINI_API_KEY) {
        result.errors.push('GEMINI_API_KEY is required for AI service');
      }

      const maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS || '1000');
      if (isNaN(maxTokens) || maxTokens < 1 || maxTokens > 2048) {
        result.warnings.push('GEMINI_MAX_TOKENS should be between 1 and 2048');
      }

      const temperature = parseFloat(process.env.GEMINI_TEMPERATURE || '0.7');
      if (isNaN(temperature) || temperature < 0 || temperature > 2) {
        result.warnings.push('GEMINI_TEMPERATURE should be between 0 and 2');
      }

      // Test AI service availability
      const isAvailable = await checkAIServiceAvailability();
      if (!isAvailable) {
        result.errors.push('AI service is not available');
      }

    } else if (serviceType === 'mock') {
      // Mock service validation (less strict)
      const responseStyle = process.env.MOCK_RESPONSE_STYLE;
      if (responseStyle && !['helpful', 'casual', 'formal', 'technical'].includes(responseStyle)) {
        result.warnings.push('MOCK_RESPONSE_STYLE should be one of: helpful, casual, formal, technical');
      }
    } else {
      result.errors.push('Invalid service type. Must be "ai" or "mock"');
    }

    result.isValid = result.errors.length === 0;
    return result;

  } catch (error) {
    logger.error('Error validating service config:', error);
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
}; 