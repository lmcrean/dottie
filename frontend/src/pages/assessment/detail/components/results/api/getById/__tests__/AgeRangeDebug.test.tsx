import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgeRange } from '../../../../detail/components/results/results-details/AgeRange';

describe('AgeRange debugging', () => {
  it('should correctly display age under-13', () => {
    render(<AgeRange age={'under-13'} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('Under 13 years');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: "under-13"');
  });

  it('should correctly display age 13-17', () => {
    render(<AgeRange age={'13-17'} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('13-17 years');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: "13-17"');
  });

  it('should correctly display age 18-24', () => {
    render(<AgeRange age={'18-24'} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('18-24 years');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: "18-24"');
  });

  it('should correctly display age 25-plus', () => {
    render(<AgeRange age={'25-plus'} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('25+ years');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: "25-plus"');
  });

  it('should handle string values that are not in the map', () => {
    render(<AgeRange age={'unknown-value'} />);
    
    // Should pass through the unknown value
    expect(screen.getByTestId('age-value').textContent).toBe('unknown-value');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: "unknown-value"');
  });

  it('should handle null values', () => {
    render(<AgeRange age={null} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: ""');
  });

  it('should handle empty string', () => {
    render(<AgeRange age={''} />);
    
    // Check what's rendered
    expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: ""');
  });

  it('should handle age with quotes in it', () => {
    render(<AgeRange age={'"under-13"'} />);
    
    // Quotes would be part of the string, not matched in map
    expect(screen.getByTestId('age-value').textContent).toBe('"under-13"');
    expect(screen.getByTestId('debug-age-raw').textContent).toBe('Raw value: ""under-13""');
  });
}); 