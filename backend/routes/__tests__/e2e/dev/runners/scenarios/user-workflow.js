/**
 * User Management Workflow Scenarios for Development Testing
 * 
 * Tests user management flows using granular utility functions for sqlite localhost
 */

import { generateProfileUpdate } from '../user/generateProfileUpdate.js';
import { getAllUsers } from '../user/getAllUsers.js';
import { getUserById } from '../user/getUserById.js';
import { updateUserProfile } from '../user/updateUserProfile.js';
import { deleteUser } from '../user/deleteUser.js';

/**
 * Complete user management workflow test
 * Tests user retrieval, profile updates, and user deletion
 */
export async function runUserManagementWorkflow(request, expect, authToken, userId, testUser) {
  console.log('👤 Starting User Management Workflow...');
  
  try {
    // Step 1: Get all users (request, token)
    const allUsers = await getAllUsers(request, authToken);
    console.log('✅ Retrieved all users');
    
    // Step 2: Get specific user by ID (request, token, userId)
    const userById = await getUserById(request, authToken, userId);
    console.log('✅ Retrieved user by ID');
    
    // Step 3: Generate profile update data
    const profileUpdate = generateProfileUpdate();
    console.log('✅ Generated profile update data');
    
    // Step 4: Update user profile (request, token, userId, profileData)
    const updatedUser = await updateUserProfile(request, authToken, userId, profileUpdate);
    console.log('✅ User profile updated successfully');
    
    // Step 5: Verify the update by getting user again (request, token, userId)
    const verifyUpdate = await getUserById(request, authToken, userId);
    console.log('✅ Verified profile update');
    
    console.log('🎉 User Management Workflow completed successfully!');
    return updatedUser;
    
  } catch (error) {
    console.error('❌ User Management Workflow failed:', error.message);
    throw error;
  }
}

/**
 * User deletion workflow
 * Tests user deletion functionality
 */
export async function runUserDeletionWorkflow(request, expect, userId, authToken) {
  console.log('🗑️ Starting User Deletion Workflow...');
  
  try {
    // Delete the user (request, token, userId)
    const deletionResult = await deleteUser(request, authToken, userId);
    console.log('✅ User deleted successfully');
    
    console.log('🎉 User Deletion Workflow completed successfully!');
    return {
      success: true,
      deletion: deletionResult
    };
    
  } catch (error) {
    console.error('❌ User Deletion Workflow failed:', error.message);
    throw error;
  }
} 