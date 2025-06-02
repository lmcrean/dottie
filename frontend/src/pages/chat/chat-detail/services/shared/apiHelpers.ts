import axios from 'axios';
import { apiClient } from '../../../../../api/core/apiClient';
import { getUserData } from '../../../../../api/core/tokenManager';

/**
 * Base API utility for chat services with common patterns
 */

export interface ApiConfig {
  requireAuth?: boolean;
  handle404AsNull?: boolean;
  functionName?: string;
}

/**
 * Validates user authentication
 * @param functionName - Name of the calling function for logging
 * @throws Error if user is not authenticated
 */
export function validateAuth(functionName: string): void {
  const userData = getUserData();
  if (!userData || !userData.id) {
    console.error(`[${functionName}] User ID not found or invalid.`);
    throw new Error('User ID not found. Please login again.');
  }
}

/**
 * Standardized error handler
 * @param error - The caught error
 * @param functionName - Name of the calling function for logging
 * @param handle404AsNull - Whether to return null for 404 errors instead of throwing
 * @returns null if 404 and handle404AsNull is true, otherwise re-throws
 */
export function handleApiError(
  error: unknown, 
  functionName: string, 
  handle404AsNull = false
): null | never {
  if (handle404AsNull && axios.isAxiosError(error) && error.response?.status === 404) {
    return null;
  }
  
  console.error(`[${functionName}] API call failed:`, error);
  throw error;
}

/**
 * Makes an authenticated API GET request with standardized error handling
 */
export async function authenticatedGet<T>(
  url: string, 
  config: ApiConfig = {}
): Promise<T | null> {
  const { requireAuth = true, handle404AsNull = false, functionName = 'authenticatedGet' } = config;
  
  try {
    if (requireAuth) {
      validateAuth(functionName);
    }
    
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    return handleApiError(error, functionName, handle404AsNull) as T | null;
  }
}

/**
 * Makes an authenticated API POST request with standardized error handling
 */
export async function authenticatedPost<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config: ApiConfig = {}
): Promise<TResponse> {
  const { requireAuth = true, functionName = 'authenticatedPost' } = config;
  
  try {
    if (requireAuth) {
      validateAuth(functionName);
    }
    
    const response = await apiClient.post<TResponse>(url, data);
    return response.data;
  } catch (error) {
    return handleApiError(error, functionName) as never;
  }
}

/**
 * Converts various chat ID formats to string
 * @param chatId - The chat ID in various possible formats
 * @param functionName - Name of the calling function for logging
 * @returns Normalized string chat ID
 */
export function normalizeChatId(
  chatId: string | { id?: string; conversationId?: string; toString?: () => string },
  functionName: string
): string {
  if (typeof chatId === 'object' && chatId !== null) {
    console.log(`[${functionName}] Received object as chat_id:`, chatId);

    if (chatId.id) {
      const result = String(chatId.id);
      console.log(`[${functionName}] Extracted ID from object property: ${result}`);
      return result;
    }
    
    if (chatId.conversationId) {
      const result = String(chatId.conversationId);
      console.log(`[${functionName}] Extracted conversationId from object property: ${result}`);
      return result;
    }
    
    if (typeof chatId.toString === 'function' && chatId.toString() !== '[object Object]') {
      const result = chatId.toString();
      console.log(`[${functionName}] Used object's toString(): ${result}`);
      return result;
    }
    
    console.error(`[${functionName}] Cannot extract valid ID from object:`, chatId);
    throw new Error('Invalid chat ID format. Please try again.');
  }
  
  return String(chatId);
} 