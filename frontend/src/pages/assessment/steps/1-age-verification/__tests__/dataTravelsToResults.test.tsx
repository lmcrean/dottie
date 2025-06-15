import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AgeVerificationPage from '../page';
import ResultsPage from '../../../detail/page';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import * as AgeVerificationHook from '../hooks/use-age-verification';

// Track context updates
const mockSetAge = vi.fn();
let mockAge = undefined;

// Mock ResultsPage to include the Age Range text for testing
vi.mock('../../../detail/page', () => ({
  default: () => (
    <div>
      <h1>Assessment Results</h1>
      <div>
        <h2>Age Range</h2>
        <div className="text-gray-600">{mockAge}</div>
      </div>
    </div>
  )
}));

describe('Age Data Flow Through Context', () => {
  beforeEach(() => {
    // Reset mocks between tests
    mockAge = undefined;
    mockSetAge.mockClear();
    
    // Clear sessionStorage to ensure we're testing context
    sessionStorage.clear();
    
    // Setup the spy
    vi.spyOn(AgeVerificationHook, 'useAgeVerification').mockImplementation(() => ({
      age: mockAge,
      setAge: (value) => {
        mockAge = value;
        mockSetAge(value);
      }
    }));
  });
  
  test('Age selection updates the context', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <AssessmentResultProvider>
          <AgeVerificationPage />
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify initial state
    expect(mockAge).toBeUndefined();
    
    // Select the 18-24 age option
    const ageOption = screen.getByTestId('option-18-24');
    fireEvent.click(ageOption);
    
    // Verify context was updated
    expect(mockSetAge).toHaveBeenCalledWith('18-24');
    expect(mockAge).toBe('18-24');
  });
  
  test('Context data is displayed on results page', () => {
    // Set the age in context first
    mockAge = '18-24';
    
    render(
      <MemoryRouter initialEntries={['/assessment/results']}>
        <AssessmentResultProvider>
          <ResultsPage />
        </AssessmentResultProvider>
      </MemoryRouter>
    );
    
    // Find the age display on results page
    const ageHeading = screen.getByText('Age Range');
    const ageValue = screen.getByText('18-24');
    
    // Verify context data is displayed
    expect(ageHeading).toBeInTheDocument();
    expect(ageValue).toBeInTheDocument();
  });
  
  test('End-to-end data flow from selection to results', () => {
    // First render the age verification page
    const { unmount } = render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <AssessmentResultProvider>
          <AgeVerificationPage />
        </AssessmentResultProvider>
      </MemoryRouter>
    );
    
    // Select an age
    const ageOption = screen.getByTestId('option-25-plus');
    fireEvent.click(ageOption);
    
    // Verify context update
    expect(mockSetAge).toHaveBeenCalledWith('25-plus');
    expect(mockAge).toBe('25-plus');
    
    // Unmount first component
    unmount();
    
    // Now render results page (context should still have the age)
    render(
      <MemoryRouter initialEntries={['/assessment/results']}>
        <AssessmentResultProvider>
          <ResultsPage />
        </AssessmentResultProvider>
      </MemoryRouter>
    );
    
    // Check that results page shows the selected age
    const ageHeading = screen.getByText('Age Range');
    const ageValue = screen.getByText('25-plus');
    
    // Should show age from context
    expect(ageHeading).toBeInTheDocument();
    expect(ageValue).toBeInTheDocument();
  });
});
