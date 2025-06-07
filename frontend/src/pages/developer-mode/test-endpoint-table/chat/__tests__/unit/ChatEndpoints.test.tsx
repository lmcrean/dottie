import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ChatEndpoints from '../../ChatEndpoints';

// Mock the child components to isolate tests
vi.mock('../../../page-components', () => ({
  EndpointTable: ({ children, title }) => (
    <div data-testid="endpoint-table">
      <h2>{title}</h2>
      <div data-testid="endpoints">{children}</div>
    </div>
  ),
  EndpointRow: (props) => {
    // Create button data-testid in the same format as the actual implementation
    const buttonTestId = `test-${props.method.toLowerCase()} ${props.endpoint.toLowerCase().replace(/\//g, '-')}-button`;
    
    return (
      <div data-testid={`row-${props.method}-${props.endpoint}`}>
        <button data-testid={buttonTestId}>
          <span data-testid={`method-${props.method}`}>{props.method}</span>
          <span data-testid={`endpoint-${props.endpoint}`}>{props.endpoint}</span>
        </button>
        {props.requiresAuth && <div>Requires authentication</div>}
        {props.inputFields && props.inputFields.map((field, index) => (
          <div key={index} data-testid={`input-field-${field.name}`}>
            {field.name}
          </div>
        ))}
      </div>
    );
  },
}));

describe('ChatEndpoints Component', () => {
  it('renders with correct title', () => {
    render(<ChatEndpoints />);
    expect(screen.getByText('AI Chat Endpoints')).toBeInTheDocument();
  });

  it('renders the send message endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('test-post -api-chat-send-button');
    
    expect(endpoint).toBeInTheDocument();
    // Input fields are only shown when clicking the button in the actual implementation
  });

  it('renders the get history endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('test-get -api-chat-history-button');
    
    expect(endpoint).toBeInTheDocument();
  });

  it('renders the get conversation endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('test-get -api-chat-history-:conversationid-button');
    
    expect(endpoint).toBeInTheDocument();
  });

  it('renders the delete conversation endpoint correctly', () => {
    render(<ChatEndpoints />);
    const endpoint = screen.getByTestId('test-delete -api-chat-history-:conversationid-button');
    
    expect(endpoint).toBeInTheDocument();
  });
}); 