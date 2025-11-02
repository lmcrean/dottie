import logger from '../../../../../services/logger.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Service configuration interface
 */
export interface ServiceConfig {
  service: 'ai' | 'mock';
  timestamp: string;
  model?: string;
  apiKey?: string;
  responseStyle?: string;
}

/**
 * Simple configuration helper for chat services
 * Detects service type based on .env file presence
 */
export class ConfigHelper {

  /**
   * Detect which service to use based on .env file presence
   * @returns 'ai' if .env exists, 'mock' otherwise
   */
  static detectService(): 'ai' | 'mock' {
    try {
      // Check if .env file exists in project root
      const envPath = resolve(process.cwd(), '.env');
      const hasEnvFile = existsSync(envPath);

      if (hasEnvFile) {
        logger.info('Environment file detected, using AI service');
        return 'ai';
      } else {
        logger.info('No environment file found, using mock service');
        return 'mock';
      }
    } catch (error) {
      logger.error('Error detecting service, defaulting to mock:', error);
      return 'mock';
    }
  }

  /**
   * Get basic service configuration
   * @returns Service configuration
   */
  static getServiceConfig(): ServiceConfig {
    const serviceType = this.detectService();

    return {
      service: serviceType,
      timestamp: new Date().toISOString(),
      ...(serviceType === 'ai' ? {
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        apiKey: process.env.GEMINI_API_KEY
      } : {
        responseStyle: 'helpful'
      })
    };
  }
}
