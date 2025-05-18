import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { AssessmentResultProvider } from '../AssessmentResultProvider';
import { AssessmentResultContext } from '../AssessmentResultContext';

// Simplified test
describe('AssessmentResultProvider', () => {
  it('should provide the context to children', () => {
    // Create a test component that uses the context
    const TestComponent = () => {
      return (
        <AssessmentResultContext.Consumer>
          {context => {
            // Just check if context exists
            return <div data-testid="test">{context ? 'Has Context' : 'No Context'}</div>;
          }}
        </AssessmentResultContext.Consumer>
      );
    };

    const { getByTestId } = render(
      <AssessmentResultProvider>
        <TestComponent />
      </AssessmentResultProvider>
    );

    expect(getByTestId('test').textContent).toBe('Has Context');
  });
}); 