import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import User from '../../User.js';

describe('User Workflow Runner Tests (TDD Plan)', () => {
  let testUser;
  let originalEmail;
  let originalUsername;

  beforeEach(async () => {
    // Clean setup for each test
    testUser = null;
    originalEmail = `test-${Date.now()}@example.com`;
    originalUsername = `testuser-${Date.now()}`;
  });

  afterEach(async () => {
    // Clean up test data if user was created
    if (testUser?.id) {
      try {
        await User.delete(testUser.id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('Complete User Lifecycle Workflow', () => {
    it('should complete full user lifecycle: create -> authenticate -> read -> update username -> update email -> update password -> delete', async () => {
      // 1. CREATE NEW USER
      console.log('Step 1: Creating new user...');
      const userData = {
        username: originalUsername,
        email: originalEmail,
        password_hash: 'hashed_password_123',
        age: 25
      };

      const createResult = await User.create(userData);
      expect(createResult.success).toBe(true);
      expect(createResult.user).toBeDefined();
      expect(createResult.user.username).toBe(originalUsername);
      expect(createResult.user.email).toBe(originalEmail);
      expect(createResult.user.password_hash).toBeUndefined(); // Should be sanitized

      testUser = createResult.user;
      console.log('✅ User created successfully with ID:', testUser.id);

      // 2. AUTHENTICATE USER
      console.log('Step 2: Authenticating user...');
      const authResult = await User.authenticate(originalEmail, 'hashed_password_123');
      expect(authResult.success).toBe(true);
      expect(authResult.user).toBeDefined();
      expect(authResult.user.id).toBe(testUser.id);
      console.log('✅ User authenticated successfully');

      // 3. GET USER BY ID
      console.log('Step 3: Retrieving user by ID...');
      const userById = await User.findById(testUser.id);
      expect(userById).toBeDefined();
      expect(userById.id).toBe(testUser.id);
      expect(userById.username).toBe(originalUsername);
      expect(userById.email).toBe(originalEmail);
      console.log('✅ User retrieved successfully by ID');

      // 4. UPDATE USERNAME
      console.log('Step 4: Updating username...');
      const newUsername = `updated-${originalUsername}`;
      const updateUsernameResult = await User.updateUsername(testUser.id, newUsername);
      expect(updateUsernameResult.success).toBe(true);
      expect(updateUsernameResult.user).toBeDefined();
      expect(updateUsernameResult.user.username).toBe(newUsername);
      console.log('✅ Username updated successfully');

      // 5. UPDATE EMAIL
      console.log('Step 5: Updating email...');
      const newEmail = `updated-${originalEmail}`;
      const updateEmailResult = await User.updateEmail(testUser.id, newEmail);
      expect(updateEmailResult.success).toBe(true);
      expect(updateEmailResult.user).toBeDefined();
      expect(updateEmailResult.user.email).toBe(newEmail);
      console.log('✅ Email updated successfully');

      // 6. UPDATE PASSWORD
      console.log('Step 6: Updating password...');
      const newPasswordHash = 'new_hashed_password_456';
      const updatePasswordResult = await User.updatePassword(testUser.id, 'hashed_password_123', newPasswordHash);
      expect(updatePasswordResult.success).toBe(true);
      expect(updatePasswordResult.user).toBeDefined();
      console.log('✅ Password updated successfully');

      // 7. VERIFY CHANGES BY RE-AUTHENTICATION
      console.log('Step 7: Verifying changes with new credentials...');
      const reAuthResult = await User.authenticate(newEmail, newPasswordHash);
      expect(reAuthResult.success).toBe(true);
      expect(reAuthResult.user.username).toBe(newUsername);
      expect(reAuthResult.user.email).toBe(newEmail);
      console.log('✅ Re-authentication successful with new credentials');

      // 8. DELETE USER
      console.log('Step 8: Deleting user...');
      const deleteResult = await User.delete(testUser.id);
      expect(deleteResult.success).toBe(true);
      console.log('✅ User deleted successfully');

      // 9. VERIFY DELETION
      console.log('Step 9: Verifying user deletion...');
      const deletedUser = await User.findById(testUser.id);
      expect(deletedUser).toBeNull();
      console.log('✅ User deletion verified');

      testUser = null; // Prevent cleanup since user is already deleted
    });
  });

  describe('User Registration and Validation Workflow', () => {
    it('should validate user data before creation and handle errors', async () => {
      // Test validation before creation
      console.log('Step 1: Testing user data validation...');
      const invalidUserData = {
        username: '', // Invalid - empty
        email: 'invalid-email', // Invalid format
        password_hash: '123', // Invalid - too short
        age: -5 // Invalid - negative
      };

      const validationResult = await User.validateForCreation(invalidUserData);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toBeDefined();
      expect(validationResult.errors.length).toBeGreaterThan(0);
      console.log('✅ Validation correctly identified errors:', validationResult.errors);

      // Test creation with invalid data
      console.log('Step 2: Testing creation with invalid data...');
      const createResult = await User.create(invalidUserData);
      expect(createResult.success).toBe(false);
      expect(createResult.errors).toBeDefined();
      console.log('✅ Creation correctly failed with errors:', createResult.errors);

      // Test creation with valid data
      console.log('Step 3: Testing creation with valid data...');
      const validUserData = {
        username: originalUsername,
        email: originalEmail,
        password_hash: 'valid_hashed_password_123',
        age: 25
      };

      const validCreateResult = await User.create(validUserData);
      expect(validCreateResult.success).toBe(true);
      expect(validCreateResult.user).toBeDefined();

      testUser = validCreateResult.user;
      console.log('✅ Valid user created successfully');
    });
  });

  describe('User Authentication Flow Scenarios', () => {
    beforeEach(async () => {
      // Create a test user for authentication tests
      const userData = {
        username: originalUsername,
        email: originalEmail,
        password_hash: 'correct_password_hash',
        age: 30
      };

      const createResult = await User.create(userData);
      testUser = createResult.user;
    });

    it('should handle various authentication scenarios', async () => {
      // Test successful authentication
      console.log('Step 1: Testing successful authentication...');
      const successAuth = await User.authenticate(originalEmail, 'correct_password_hash');
      expect(successAuth.success).toBe(true);
      expect(successAuth.user.id).toBe(testUser.id);
      console.log('✅ Successful authentication verified');

      // Test failed authentication with wrong password
      console.log('Step 2: Testing failed authentication with wrong password...');
      const failedAuth = await User.authenticate(originalEmail, 'wrong_password_hash');
      expect(failedAuth.success).toBe(false);
      expect(failedAuth.errors).toBeDefined();
      console.log('✅ Authentication correctly failed with wrong password');

      // Test failed authentication with non-existent email
      console.log('Step 3: Testing failed authentication with non-existent email...');
      const nonExistentAuth = await User.authenticate('nonexistent@example.com', 'any_password');
      expect(nonExistentAuth.success).toBe(false);
      expect(nonExistentAuth.errors).toBeDefined();
      console.log('✅ Authentication correctly failed with non-existent email');

      // Test user status check
      console.log('Step 4: Testing user status check...');
      const statusCheck = await User.checkUserStatus(originalEmail);
      expect(statusCheck.success).toBe(true);
      expect(statusCheck.exists).toBe(true);
      expect(statusCheck.active).toBe(true);
      console.log('✅ User status check successful');
    });
  });

  describe('User Update Validation Workflow', () => {
    beforeEach(async () => {
      // Create a test user for update tests
      const userData = {
        username: originalUsername,
        email: originalEmail,
        password_hash: 'original_password_hash',
        age: 25
      };

      const createResult = await User.create(userData);
      testUser = createResult.user;
    });

    it('should validate updates and handle uniqueness constraints', async () => {
      // Create a second user to test uniqueness constraints
      console.log('Step 1: Creating second user for uniqueness tests...');
      const secondUserData = {
        username: `second-${originalUsername}`,
        email: `second-${originalEmail}`,
        password_hash: 'second_password_hash',
        age: 30
      };

      const secondUserResult = await User.create(secondUserData);
      expect(secondUserResult.success).toBe(true);
      const secondUser = secondUserResult.user;

      try {
        // Test username uniqueness validation
        console.log('Step 2: Testing username uniqueness validation...');
        const duplicateUsernameResult = await User.updateUsername(testUser.id, secondUser.username);
        expect(duplicateUsernameResult.success).toBe(false);
        expect(duplicateUsernameResult.errors).toContain('Username already exists');
        console.log('✅ Username uniqueness constraint enforced');

        // Test email uniqueness validation
        console.log('Step 3: Testing email uniqueness validation...');
        const duplicateEmailResult = await User.updateEmail(testUser.id, secondUser.email);
        expect(duplicateEmailResult.success).toBe(false);
        expect(duplicateEmailResult.errors).toContain('Email already exists');
        console.log('✅ Email uniqueness constraint enforced');

        // Test successful username update
        console.log('Step 4: Testing successful username update...');
        const validUsernameUpdate = await User.updateUsername(testUser.id, `updated-${originalUsername}`);
        expect(validUsernameUpdate.success).toBe(true);
        expect(validUsernameUpdate.user.username).toBe(`updated-${originalUsername}`);
        console.log('✅ Username updated successfully');

        // Test successful email update
        console.log('Step 5: Testing successful email update...');
        const validEmailUpdate = await User.updateEmail(testUser.id, `updated-${originalEmail}`);
        expect(validEmailUpdate.success).toBe(true);
        expect(validEmailUpdate.user.email).toBe(`updated-${originalEmail}`);
        console.log('✅ Email updated successfully');

      } finally {
        // Clean up second user
        await User.delete(secondUser.id);
      }
    });
  });

  describe('User Deletion Workflow', () => {
    it('should handle deletion preview and soft delete options', async () => {
      // Create user with some data
      console.log('Step 1: Creating user for deletion tests...');
      const userData = {
        username: originalUsername,
        email: originalEmail,
        password_hash: 'password_hash',
        age: 25
      };

      const createResult = await User.create(userData);
      testUser = createResult.user;

      // Test deletion preview
      console.log('Step 2: Testing deletion preview...');
      const previewResult = await User.getDeletionPreview(testUser.id);
      expect(previewResult.success).toBe(true);
      expect(previewResult.preview).toBeDefined();
      expect(previewResult.preview.user).toBeDefined();
      expect(previewResult.preview.relatedData).toBeDefined();
      console.log('✅ Deletion preview generated successfully');

      // Test soft delete
      console.log('Step 3: Testing soft delete...');
      const softDeleteResult = await User.softDelete(testUser.id);
      expect(softDeleteResult.success).toBe(true);
      expect(softDeleteResult.user.deleted_at).toBeDefined();
      console.log('✅ User soft deleted successfully');

      // Verify user still exists but marked as deleted
      console.log('Step 4: Verifying soft delete status...');
      const softDeletedUser = await User.findById(testUser.id, false); // Get unsanitized
      expect(softDeletedUser).toBeDefined();
      expect(softDeletedUser.deleted_at).toBeDefined();
      console.log('✅ Soft delete status verified');

      // Test hard delete
      console.log('Step 5: Testing hard delete...');
      const hardDeleteResult = await User.delete(testUser.id);
      expect(hardDeleteResult.success).toBe(true);
      console.log('✅ User hard deleted successfully');

      // Verify user is completely removed
      console.log('Step 6: Verifying hard delete...');
      const deletedUser = await User.findById(testUser.id);
      expect(deletedUser).toBeNull();
      console.log('✅ Hard delete verified');

      testUser = null; // Prevent cleanup
    });
  });
}); 