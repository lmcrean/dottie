import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import JsonDisplay from '../JsonDisplay';

describe('JsonDisplay Component', () => {
  it('should properly format and display valid JSON data', () => {
    const testData = { 
      name: 'Test User', 
      age: 30, 
      address: {
        city: 'Test City',
        zipCode: '12345'
      }
    };
    
    render(<JsonDisplay data={testData} />);
    
    const preElement = screen.getByText(/"name": "Test User"/);
    expect(preElement).toBeInTheDocument();
    expect(preElement.textContent).toContain('"age": 30');
    expect(preElement.textContent).toContain('"city": "Test City"');
  });
  
  it('should display error message for invalid JSON data', () => {
    // Create circular reference that can't be stringified
    const circularObj: any = {};
    circularObj.self = circularObj;
    
    render(<JsonDisplay data={circularObj} />);
    
    expect(screen.getByText('Invalid JSON data')).toBeInTheDocument();
  });
  
  it('should apply expected styling when isExpected is true', () => {
    render(<JsonDisplay data={{ test: 'data' }} isExpected={true} />);
    
    const preElement = screen.getByText(/"test": "data"/);
    expect(preElement).toHaveClass('text-gray-300');
  });
  
  it('should apply default styling when isExpected is false', () => {
    render(<JsonDisplay data={{ test: 'data' }} isExpected={false} />);
    
    const preElement = screen.getByText(/"test": "data"/);
    expect(preElement).toHaveClass('text-white');
  });
  
  it('should apply default styling when isExpected is not provided', () => {
    render(<JsonDisplay data={{ test: 'data' }} />);
    
    const preElement = screen.getByText(/"test": "data"/);
    expect(preElement).toHaveClass('text-white');
  });
}); 