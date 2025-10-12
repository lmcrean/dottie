/**
 * Helper functions to check response status codes
 */

export const isSuccess = (status: number): boolean => status >= 200 && status < 300;

export const isClientError = (status: number): boolean => status >= 400 && status < 500;

export const isServerError = (status: number): boolean => status >= 500;
