import { getAuthToken, getRefreshToken } from '../../../core/tokenManager';

/**
 * Frontend-only function to verify current token status
 * This doesn't make an API request but checks auth tokens directly using the token manager
 */
export default function getTokenVerification() {
  // Get token status using the token manager
  const authToken = getAuthToken();
  const refreshToken = getRefreshToken();

  return {
    data: {
      success: true,
      authTokenExists: !!authToken,
      refreshTokenExists: !!refreshToken,
      authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
      refreshTokenValue: refreshToken ? `${refreshToken.substring(0, 10)}...` : null
    }
  };
}
