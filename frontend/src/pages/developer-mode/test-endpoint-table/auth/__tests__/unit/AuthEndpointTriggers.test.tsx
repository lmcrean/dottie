import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import AuthEndpoints from '../../AuthEndpoints';

// Mock the component imports
vi.mock('../../post-auth-signup/EndpointRow', () => ({
  default: () => {
    return <div data-testid="mock-signup">Signup Component</div>;
  }
}));

vi.mock('../../post-auth-login/EndpointRow', () => ({
  default: () => {
    return <div data-testid="mock-login">Login Component</div>;
  }
}));

vi.mock('../../post-auth-logout/EndpointRow', () => ({
  default: () => {
    return <div data-testid="mock-logout">Logout Component</div>;
  }
}));

vi.mock('../../../../page-components', () => ({
  EndpointTable: ({ children }) => <div>{children}</div>
}));

describe('AuthEndpoint Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the auth endpoints', () => {
    const { getByTestId } = render(<AuthEndpoints />);
    expect(getByTestId('mock-signup')).toBeInTheDocument();
    expect(getByTestId('mock-login')).toBeInTheDocument();
    expect(getByTestId('mock-logout')).toBeInTheDocument();
  });
}); 