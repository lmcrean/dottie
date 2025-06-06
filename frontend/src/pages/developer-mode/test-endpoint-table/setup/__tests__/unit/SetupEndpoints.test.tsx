import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SetupEndpoints from '../../SetupEndpoints';

// Mock the axios module
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the EndpointTable and EndpointRow components
vi.mock('../../../../page-components', () => ({
  EndpointTable: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="endpoint-table">
      <h2>{title}</h2>
      <div data-testid="endpoint-rows">{children}</div>
    </div>
  ),
  EndpointRow: ({ method, endpoint, expectedOutput }: { 
    method: string; 
    endpoint: string; 
    expectedOutput: any; 
  }) => (
    <div data-testid={`endpoint-row-${endpoint}`}>
      <div data-testid="method">{method}</div>
      <div data-testid="endpoint">{endpoint}</div>
      <div data-testid="expected-output">{JSON.stringify(expectedOutput)}</div>
    </div>
  ),
}));

describe('SetupEndpoints Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with correct title and endpoints', () => {
    render(<SetupEndpoints />);
    
    // Check if title is rendered
    expect(screen.getByText('Setup Endpoints')).toBeInTheDocument();
    
    // Check if all endpoints are rendered
    expect(screen.getByTestId('endpoint-row-/api/setup/health/hello')).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-row-/api/setup/database/status')).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-row-/api/setup/database/hello')).toBeInTheDocument();
  });

  it('passes correct props to EndpointRow components', () => {
    render(<SetupEndpoints />);
    
    // Health hello endpoint
    const healthEndpoint = screen.getByTestId('endpoint-row-/api/setup/health/hello');
    expect(healthEndpoint.querySelector('[data-testid="method"]')?.textContent).toBe('GET');
    expect(healthEndpoint.querySelector('[data-testid="endpoint"]')?.textContent).toBe('/api/setup/health/hello');
    expect(healthEndpoint.querySelector('[data-testid="expected-output"]')?.textContent).toBe(
      JSON.stringify({ message: "Hello World from Dottie API!" })
    );
    
    // Database status endpoint
    const dbStatusEndpoint = screen.getByTestId('endpoint-row-/api/setup/database/status');
    expect(dbStatusEndpoint.querySelector('[data-testid="method"]')?.textContent).toBe('GET');
    expect(dbStatusEndpoint.querySelector('[data-testid="endpoint"]')?.textContent).toBe('/api/setup/database/status');
    expect(dbStatusEndpoint.querySelector('[data-testid="expected-output"]')?.textContent).toBe(
      JSON.stringify({ status: "connected" })
    );
    
    // Database hello endpoint
    const dbHelloEndpoint = screen.getByTestId('endpoint-row-/api/setup/database/hello');
    expect(dbHelloEndpoint.querySelector('[data-testid="method"]')?.textContent).toBe('GET');
    expect(dbHelloEndpoint.querySelector('[data-testid="endpoint"]')?.textContent).toBe('/api/setup/database/hello');
    expect(dbHelloEndpoint.querySelector('[data-testid="expected-output"]')?.textContent).toBe(
      JSON.stringify({ 
        message: "Hello World from SQLite!", 
        dbType: "sqlite3", 
        isConnected: true 
      })
    );
  });
}); 