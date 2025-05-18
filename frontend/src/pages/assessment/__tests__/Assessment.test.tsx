import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Import all assessment pages
import AgeVerificationPage from '../steps/1-age-verification/page';
import CycleLengthPage from '../steps/2-cycle-length/page';
import PeriodDurationPage from '../steps/3-period-duration/page';
import FlowPage from '../steps/flow/page';
import PainPage from '../steps/pain/page';
import SymptomsPage from '../steps/6-symptoms/page';
import ResultsPage from '../detail/page';
import { AuthProvider } from '@/src/pages/auth/context/AuthContextProvider';

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthProvider>
  );
};

describe('Assessment Components', () => {
  describe('Age Verification Page', () => {
    it('should render the age verification page correctly', () => {
      renderWithRouter(<AgeVerificationPage />);
      expect(screen.getByText(/what is your age range/i)).toBeInTheDocument();
      expect(screen.getByText(/under 13 years/i)).toBeInTheDocument();
      expect(screen.getByText(/13-17 years/i)).toBeInTheDocument();
      expect(screen.getByText(/18-24 years/i)).toBeInTheDocument();
      expect(screen.getByText(/25\+ years/i)).toBeInTheDocument();
    });
  });

  describe('Cycle Length Page', () => {
    it('should render the cycle length page correctly', () => {
      renderWithRouter(<CycleLengthPage />);
      expect(screen.getByText(/how long is your menstrual cycle/i)).toBeInTheDocument();
      expect(screen.getByText(/21-25 days/i)).toBeInTheDocument();
      expect(screen.getByText(/26-30 days/i)).toBeInTheDocument();
      expect(screen.getByText(/31-35 days/i)).toBeInTheDocument();
      expect(screen.getByText(/irregular/i)).toBeInTheDocument();
    });
  });

  describe('Period Duration Page', () => {
    it('should render the period duration page correctly', () => {
      renderWithRouter(<PeriodDurationPage />);
      // Checking for the actual text that's in the component
      expect(
        screen.getByText(/how many days does your period typically last/i)
      ).toBeInTheDocument();
      // Find at least one of the duration options
      expect(screen.getByLabelText(/1-3 days/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/4-5 days/i)).toBeInTheDocument();
    });
  });

  describe('Flow Page', () => {
    it('should render the flow page correctly', () => {
      renderWithRouter(<FlowPage />);
      expect(screen.getByText(/how would you describe your menstrual flow/i)).toBeInTheDocument();

      // Use exact text in the labels instead of getByLabelText which is finding multiple matches
      const lightLabel = screen.getAllByText('Light')[0];
      expect(lightLabel).toBeInTheDocument();

      const moderateLabel = screen.getAllByText('Moderate')[0];
      expect(moderateLabel).toBeInTheDocument();

      const heavyLabel = screen.getAllByText('Heavy')[0];
      expect(heavyLabel).toBeInTheDocument();
    });
  });

  describe('Pain Page', () => {
    it('should render the pain page correctly', () => {
      renderWithRouter(<PainPage />);
      expect(screen.getByText(/how would you rate your menstrual pain/i)).toBeInTheDocument();
      // Find labels for pain options instead of just text
      expect(screen.getByLabelText(/no pain/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mild/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/moderate/i)).toBeInTheDocument();
    });
  });

  describe('Symptoms Page', () => {
    it('should render the symptoms page correctly', () => {
      renderWithRouter(<SymptomsPage />);
      expect(screen.getByText(/do you experience any other symptoms/i)).toBeInTheDocument();
      // Check for the section headers
      expect(screen.getByText(/physical symptoms/i)).toBeInTheDocument();
      // Common physical symptoms as exact text matches within symptom labels
      const symptoms = screen.getAllByText('Bloating');
      expect(symptoms.length).toBeGreaterThan(0);
      const fatigue = screen.getAllByText('Fatigue');
      expect(fatigue.length).toBeGreaterThan(0);
    });
  });

  describe('Results Page', () => {
    it('should render the results page correctly', () => {
      renderWithRouter(<ResultsPage />);
      expect(screen.getByText(/your assessment results/i)).toBeInTheDocument();
      // Some common elements that should be present
      expect(screen.getByText(/based on your responses/i)).toBeInTheDocument();
    });
  });
});
