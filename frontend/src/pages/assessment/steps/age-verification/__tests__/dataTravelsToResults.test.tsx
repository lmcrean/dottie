import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AgeVerificationPage from '../page';
import ResultsPage from '../../../results/page';
import { AssessmentResultProvider } from '@/src/pages/assessment/context/AssessmentResultProvider';

// Track context updates
const mockSetAge = vi.fn();
let mockAge = undefined;

// Mock the hook to track context updates
vi.mock('@/src/pages/assessment/steps/age-verification/hooks/use-age-verification', () => ({
  useAgeVerification: () => ({
    age: mockAge,
    setAge: (value) => {
      mockAge = value;
      mockSetAge(value);
    }
  })
}));

// Mock the assessment result hook to use our tracked age
vi.mock('@/src/hooks/assessment/use-assessment-result', () => ({
  useAssessmentResult: () => ({
    result: { 
      age: mockAge,
      physical_symptoms: [],
      emotional_symptoms: [],
      cycle_length: undefined,
      flow_heaviness: undefined,
      pain_level: undefined
    },
    transformToFlattenedFormat: vi.fn().mockReturnValue({})
  })
}));

// Mock the auth context since it's used in ResultsPage
vi.mock('@/src/context/auth/useAuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock the chat components
vi.mock('@/src/pages/chat/page', () => ({
  ChatModal: () => <div data-testid="chat-modal" />
}));

vi.mock('@/src/pages/chat/FullScreenChat', () => ({
  FullscreenChat: () => <div data-testid="fullscreen-chat" />
}));

describe('Age Data Flow Through Context', () => {
  beforeEach(() => {
    // Reset mocks between tests
    mockAge = undefined;
    mockSetAge.mockClear();
    
    // Clear sessionStorage to ensure we're testing context
    sessionStorage.clear();
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
    const ageContainer = ageHeading.closest('div')?.parentElement;
    const ageValue = ageContainer?.querySelector('.text-gray-600');
    
    // Verify context data is displayed
    expect(ageValue).toHaveTextContent('18-24');
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
    const ageContainer = ageHeading.closest('div')?.parentElement;
    const ageValue = ageContainer?.querySelector('.text-gray-600');
    
    // Should show age from context
    expect(ageValue).toHaveTextContent('25-plus');
  });
});
