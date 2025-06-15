import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import { AgeRange } from '@/src/pages/assessment/steps/context/types';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';

// Import the hook before mocking it
import * as AgeVerificationHook from '@/src/pages/assessment/steps/1-age-verification/hooks/use-age-verification';

// Mock modules before importing components
vi.mock('@/src/pages/assessment/steps/1-age-verification/hooks/use-age-verification');

// Explicitly mock the useQuickNavigate hook
vi.mock('@/src/hooks/useQuickNavigate', () => {
  return {
    useQuickNavigate: () => ({ isQuickResponse: false })
  };
});

// Now we can import the component after all mocks are set up
import AgeVerificationPage from '../page';

// Helper function to simplify rendering with all necessary providers
function renderWithProviders(ui: ReactElement) {
  return render(
    <BrowserRouter>
      <AssessmentResultProvider>
        {ui}
      </AssessmentResultProvider>
    </BrowserRouter>
  );
}

describe('AgeVerification Button Selection', () => {
  const mockSetAge = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AgeVerificationHook.useAgeVerification).mockReturnValue({
      age: undefined,
      setAge: mockSetAge
    });
  });

  it('should update state when option is clicked', async () => {
    // Render component
    renderWithProviders(<AgeVerificationPage />);
    
    // Find the 18-24 option by test ID
    const option = screen.getByTestId('option-18-24');
    expect(option).toBeTruthy();
    
    // Click on the option
    fireEvent.click(option);
    
    // Verify setAge was called with correct value
    expect(mockSetAge).toHaveBeenCalledWith('18-24');
  });

  it('should show selected state when option is clicked', async () => {
    // Mock hook to return a specific age value
    vi.mocked(AgeVerificationHook.useAgeVerification).mockReturnValue({
      age: '25-plus',
      setAge: mockSetAge
    });
    
    renderWithProviders(<AgeVerificationPage />);
    
    // Find the 25+ option and verify it shows as selected
    const option = screen.getByTestId('option-25-plus');
    expect(option.className).toContain('bg-pink-50');
    expect(option.className).toContain('border-pink-500');
  });

  it('should enable continue button when an option is selected', async () => {
    // Mock hook to return a specific age value
    vi.mocked(AgeVerificationHook.useAgeVerification).mockReturnValue({
      age: '13-17', 
      setAge: mockSetAge
    });
    
    renderWithProviders(<AgeVerificationPage />);
    
    // Verify the continue button is enabled
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).not.toBeDisabled();
  });

  it('should handle direct div clicks on option container', async () => {
    // Prepare mock
    vi.mocked(AgeVerificationHook.useAgeVerification).mockReturnValue({
      age: undefined,
      setAge: mockSetAge
    });

    renderWithProviders(<AgeVerificationPage />);
    
    // Find option container by text
    const underThirteenOption = screen.getByText('Under 13 years').closest('div');
    expect(underThirteenOption).toBeTruthy();
    
    // Click the container div
    if (underThirteenOption) {
      fireEvent.click(underThirteenOption);
    }
    
    // Verify setAge was called with correct value
    expect(mockSetAge).toHaveBeenCalledWith('under-13');
  });

  it('should directly trigger setAge when clicked', async () => {
    // Use a real implementation that tracks if setAge was called
    let ageWasSet = false;
    const realSetAge = (age: AgeRange) => {
      ageWasSet = true;
      return age;
    };

    // Prepare mock with real implementation
    vi.mocked(AgeVerificationHook.useAgeVerification).mockReturnValue({
      age: undefined,
      setAge: realSetAge
    });

    renderWithProviders(<AgeVerificationPage />);
    
    // Find and click an option
    const thirteenToSeventeenOption = screen.getByText('13-17 years').closest('div');
    if (thirteenToSeventeenOption) {
      fireEvent.click(thirteenToSeventeenOption);
    }
    
    // Verify our real implementation was called
    expect(ageWasSet).toBe(true);
  });
}); 