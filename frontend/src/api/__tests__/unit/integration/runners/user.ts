/**
 * User Utilities for Integration Tests
 *
 * This file contains helper functions for user-related operations
 * in integration tests, such as getting user info, updating profiles, etc.
 */
import { api } from "./apiClient";
import { AxiosError } from "axios";

interface UserData {
  id: string;
  username: string;
  email: string;
  [key: string]: any;
}

interface ProfileData {
  username?: string;
  age?: string;
  [key: string]: any;
}

/**
 * Get user information by ID
 * @param {string} userId - User ID
 * @returns {Promise<UserData>} User data
 */
export async function getUserById(userId: string): Promise<UserData> {
  try {
    const response = await api.get(`/api/auth/users/${userId}`);

    return response.data;
  } catch (error) {
    console.error(
      "Failed to get user info:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to get user info: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Get current user information using the /me endpoint
 * @returns {Promise<UserData>} Current user data
 */
export async function getCurrentUser(): Promise<UserData> {
  try {
    const response = await api.get("/api/auth/users/me");

    return response.data;
  } catch (error) {
    console.error(
      "Failed to get current user info:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to get current user info: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Get all users (admin operation)
 * @returns {Promise<UserData[]>} List of users
 */
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const response = await api.get("/api/auth/users");

    return response.data;
  } catch (error) {
    console.error(
      "Failed to get all users:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to get all users: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Update user profile information
 * @param {string} userId - User ID
 * @param {ProfileData} profileData - Updated profile data
 * @returns {Promise<UserData>} Updated user data
 */
export async function updateUserProfile(
  userId: string,
  profileData: ProfileData
): Promise<UserData> {
  try {
    const response = await api.put(`/api/auth/users/${userId}`, profileData);

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update user profile:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to update user profile: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Update current user profile using /me endpoint
 * @param {ProfileData} profileData - Updated profile data
 * @returns {Promise<UserData>} Updated user data
 */
export async function updateCurrentUserProfile(
  profileData: ProfileData
): Promise<UserData> {
  try {
    const response = await api.put("/api/auth/users/me", profileData);

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update current user profile:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to update current user profile: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Delete a user account
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await api.delete(`/api/auth/users/${userId}`);

    return response.status === 200;
  } catch (error) {
    console.error(
      "Failed to delete user:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to delete user: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Generate random profile data for updating user
 * @param {string} usernamePrefix - Prefix for username
 * @returns {ProfileData} Profile update data
 */
export function generateProfileUpdate(usernamePrefix = "updated"): ProfileData {
  const timestamp = Date.now();
  return {
    username: `${usernamePrefix}_${timestamp}`,
    age: "25_34",
  };
}
