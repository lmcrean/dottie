/**
 * Email service for sending transactional emails
 * This is a mock implementation for development and testing
 */
class EmailService {
  /**
   * Send a password reset email
   * @param {string} to - Recipient email address
   * @param {string} resetToken - Password reset token
   * @returns {Promise<boolean>} - Success indicator
   */
  static async sendPasswordResetEmail(to, resetToken) {
    // Log the email details in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
        ========== MOCK PASSWORD RESET EMAIL ==========
        To: ${to}
        Subject: Reset your password
        Token: ${resetToken}
        Reset Link: http://localhost:3000/reset-password?token=${resetToken}
        ===============================================
      `);
    }
    
    // For testing, special emails return specific results
    if (to === 'error@user') {
      return Promise.reject(new Error('Failed to send password reset email'));
    }
    
    // Return success for all other emails
    return Promise.resolve(true);
  }
}

export default EmailService; 