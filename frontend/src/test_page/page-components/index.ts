import EndpointRow from './EndpointRow';
import EndpointButton from './EndpointButton';
import JsonDisplay from './JsonDisplay';
import ApiResponse from './ApiResponse';
import InputForm from './InputForm';
import EndpointTable from './EndpointTable';
import AuthStatus from './AuthStatus';

// Create a utility for test credential management
export const testCredentialsManager = {
  storeCredentials: (credentials: { email: string; password: string; username?: string }) => {
    localStorage.setItem('test_signup_credentials', JSON.stringify(credentials));
    window.dispatchEvent(new CustomEvent('signup_credentials_updated'));
  },

  getCredentials: () => {
    const storedData = localStorage.getItem('test_signup_credentials');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored credentials:', error);
        return null;
      }
    }
    return null;
  }
};

export {
  EndpointRow,
  EndpointButton,
  JsonDisplay,
  ApiResponse,
  InputForm,
  EndpointTable,
  AuthStatus
};
