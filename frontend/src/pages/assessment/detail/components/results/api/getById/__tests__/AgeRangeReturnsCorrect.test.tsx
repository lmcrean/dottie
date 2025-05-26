import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgeRange } from '../../../results-details/AgeRange';
import * as useAssessmentDataModule from '@/src/pages/assessment/steps/context/hooks/useAssessmentData';
import * as useAssessmentResultModule from '@/src/pages/assessment/steps/context/hooks/use-assessment-result';

// Mock the modules we depend on
vi.mock('@/src/pages/assessment/context/hooks/useAssessmentData', () => ({
  useAssessmentData: vi.fn()
}));

vi.mock('@/src/pages/assessment/context/hooks/use-assessment-result', () => ({
  useAssessmentResult: vi.fn()
}));

describe('AgeRange component', () => {
  describe('Direct component tests', () => {
    it('should display "Not specified" when age is null', () => {
      render(<AgeRange age={null} />);
      expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    });

    it('should display "Not specified" when age is empty string', () => {
      render(<AgeRange age={''} />);
      expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    });

    it('should properly map "under-13" to "Under 13 years"', () => {
      render(<AgeRange age={'under-13'} />);
      expect(screen.getByTestId('age-value').textContent).toBe('Under 13 years');
    });

    it('should properly map "13-17" to "13-17 years"', () => {
      render(<AgeRange age={'13-17'} />);
      expect(screen.getByTestId('age-value').textContent).toBe('13-17 years');
    });

    it('should properly map "18-24" to "18-24 years"', () => {
      render(<AgeRange age={'18-24'} />);
      expect(screen.getByTestId('age-value').textContent).toBe('18-24 years');
    });

    it('should properly map "25-plus" to "25+ years"', () => {
      render(<AgeRange age={'25-plus'} />);
      expect(screen.getByTestId('age-value').textContent).toBe('25+ years');
    });

    it('should display the original value if no mapping exists', () => {
      render(<AgeRange age={'unknown-age'} />);
      expect(screen.getByTestId('age-value').textContent).toBe('unknown-age');
    });
  });

  describe('Testing the full dependency chain', () => {
    // Reset all mocks before each test
    beforeEach(() => {
      vi.resetAllMocks();
    });
    
    it('should receive the correct age from the assessment context chain', () => {
      // Mock the useAssessmentResult hook
      const mockResult = {
        age: '18-24' as const,
        cycle_length: '26-30' as const,
        period_duration: '4-5' as const,
        flow_heaviness: 'moderate' as const,
        pain_level: 'mild' as const,
        physical_symptoms: [],
        emotional_symptoms: [],
        pattern: 'regular' as const,
        other_symptoms: '',
        created_at: new Date().toISOString(),
        recommendations: []
      };
      
      vi.mocked(useAssessmentResultModule.useAssessmentResult).mockReturnValue({
        result: mockResult,
        isComplete: true,
        transformToFlattenedFormat: () => mockResult
      });

      // Mock the useAssessmentData hook which is used by results page
      vi.mocked(useAssessmentDataModule.useAssessmentData).mockReturnValue({
        pattern: 'regular',
        age: '18-24', // This is what should be passed to AgeRange
        cycle_length: '26-30',
        periodDuration: '4-5',
        flowLevel: 'moderate',
        painLevel: 'mild',
        symptoms: [],
        expandableSymptoms: false,
        isClamped: false,
        setExpandableSymptoms: vi.fn(),
        setIsClamped: vi.fn()
      });

      // Create a debug wrapper component that logs the actual prop
      const DebugAgeRangeWrapper = () => {
        const { age } = useAssessmentDataModule.useAssessmentData();

        return <AgeRange age={age} />;
      };

      // Render our debug wrapper
      render(<DebugAgeRangeWrapper />);

      // Verify the age is displayed correctly
      expect(screen.getByTestId('age-value').textContent).toBe('18-24 years');
      
      // Verify our hooks were called
      expect(useAssessmentDataModule.useAssessmentData).toHaveBeenCalledTimes(1);
    });
    
    it('should display "Not specified" when age is null in context', () => {
      // Mock with null age value to simulate the issue
      vi.mocked(useAssessmentDataModule.useAssessmentData).mockReturnValue({
        pattern: 'regular',
        age: '', // Empty age should trigger "Not specified"
        cycle_length: '26-30',
        periodDuration: '4-5',
        flowLevel: 'moderate',
        painLevel: 'mild',
        symptoms: [],
        expandableSymptoms: false,
        isClamped: false,
        setExpandableSymptoms: vi.fn(),
        setIsClamped: vi.fn()
      });

      // Create a wrapper component that uses the hook directly
      const AgeRangeWithContext = () => {
        const { age } = useAssessmentDataModule.useAssessmentData();
        return <AgeRange age={age} />;
      };

      render(<AgeRangeWithContext />);
      
      // This should match what happens in the real app
      expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    });
  });
});
