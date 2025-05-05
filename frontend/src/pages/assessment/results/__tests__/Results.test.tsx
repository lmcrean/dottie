import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ResultsPage from '../page'
import { AuthContext } from '@/src/context/auth/AuthContext'
import { AssessmentResultContext } from '@/src/context/assessment/AssessmentResultContext'
import { postSend } from '@/src/api/assessment/requests/postSend/Request'

// Mock API call
vi.mock('@/src/api/assessment/requests/postSend/Request', () => ({
  postSend: vi.fn().mockResolvedValue({ id: 'mock-assessment-id' })
}))

// Mock AuthContext
const mockAuthContext = {
  user: { id: 'mock-user-id' },
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  updatePassword: vi.fn(),
  clearError: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  error: null,
  severity: null
} as any;

// Create a function to get a customized mock for AssessmentResultContext
const getMockAssessmentResultContext = (pattern = 'regular') => ({
  state: {
    result: {
      pattern,
      recommendations: [],
      age: '18-24',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      symptoms: {
        physical: [],
        emotional: []
      }
    },
    isComplete: true
  },
  setResult: vi.fn(),
  updateResult: vi.fn(),
  resetResult: vi.fn(),
  setPattern: vi.fn(),
  setRecommendations: vi.fn(),
  transformToFlattenedFormat: vi.fn().mockReturnValue({
    age: '18-24',
    pattern: pattern,
    cycle_length: '26-30',
    period_duration: '4-5',
    flow_heaviness: 'moderate',
    pain_level: 'mild',
    physical_symptoms: [],
    emotional_symptoms: [],
    recommendations: []
  })
} as any);

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Wrap component with providers
const renderWithProviders = (component: React.ReactNode, pattern = 'regular') => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <AssessmentResultContext.Provider value={getMockAssessmentResultContext(pattern)}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AssessmentResultContext.Provider>
    </AuthContext.Provider>
  )
}

describe('Assessment Results Page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders common UI elements', () => {
    renderWithProviders(<ResultsPage />);
    
    expect(screen.getByText('Your Assessment Results')).toBeInTheDocument();
    expect(screen.getByText('Chat with Dottie')).toBeInTheDocument();
    expect(screen.getByText('Save Results')).toBeInTheDocument();
    expect(screen.getByText('View History')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  // Test all 5 patterns from LogicTree.md
  // Pattern 1: Regular Cycles (O4 in LogicTree)
  it('renders regular menstrual cycle pattern correctly', () => {
    // Set up session storage with regular cycle data 
    window.sessionStorage.setItem('cycleLength', JSON.stringify('26-30'));
    window.sessionStorage.setItem('periodDuration', JSON.stringify('4-5'));
    window.sessionStorage.setItem('flowHeaviness', JSON.stringify('moderate'));
    window.sessionStorage.setItem('painLevel', JSON.stringify('mild'));
    window.sessionStorage.setItem('age', JSON.stringify('18-24'));
    
    renderWithProviders(<ResultsPage />, 'regular');
    
    // Check for correct pattern title and recommendations
    expect(screen.getByText('Regular Menstrual Cycles')).toBeInTheDocument();
    expect(screen.getByText('Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.')).toBeInTheDocument();
    
    // Check recommendations specific to regular pattern
    expect(screen.getByText('Track Your Cycle')).toBeInTheDocument();
    expect(screen.getByText('Exercise Regularly')).toBeInTheDocument();
    expect(screen.getByText('Maintain a Balanced Diet')).toBeInTheDocument();
    expect(screen.getByText('Prioritize Sleep')).toBeInTheDocument();
  });

  // Pattern 2: Irregular Timing Pattern (O1 in LogicTree)
  it('renders irregular timing pattern correctly', () => {
    // Set up session storage with irregular cycle data
    window.sessionStorage.setItem('cycleLength', JSON.stringify('irregular'));
    window.sessionStorage.setItem('age', JSON.stringify('25-35'));
    
    renderWithProviders(<ResultsPage />, 'irregular');
    
    // Check for irregular pattern title and description
    expect(screen.getByText('Irregular Timing Pattern')).toBeInTheDocument();
    expect(screen.getByText('Your cycle length is outside the typical range, which may indicate hormonal fluctuations.')).toBeInTheDocument();
    
    // Check recommendations specific to irregular pattern
    expect(screen.getByText('Track Your Cycle')).toBeInTheDocument();
    expect(screen.getByText('Consult a Healthcare Provider')).toBeInTheDocument();
    expect(screen.getByText('Focus on Nutrition')).toBeInTheDocument();
    expect(screen.getByText('Stress Management')).toBeInTheDocument();
  });

  // Pattern 3: Heavy or Prolonged Flow (O2 in LogicTree)
  it('renders heavy flow pattern correctly', () => {
    // Set up session storage with heavy flow data
    window.sessionStorage.setItem('flowHeaviness', JSON.stringify('heavy'));
    window.sessionStorage.setItem('periodDuration', JSON.stringify('8-plus'));
    
    renderWithProviders(<ResultsPage />, 'heavy');
    
    // Check for heavy flow pattern title and description
    expect(screen.getByText('Heavy or Prolonged Flow Pattern')).toBeInTheDocument();
    expect(screen.getByText('Your flow is heavier or longer than typical, which could impact your daily activities.')).toBeInTheDocument();
    
    // Check recommendations specific to heavy flow pattern
    expect(screen.getByText('Iron-rich Foods')).toBeInTheDocument();
    expect(screen.getByText('Stay Hydrated')).toBeInTheDocument();
    expect(screen.getByText('Medical Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Plan Ahead')).toBeInTheDocument();
  });

  // Pattern 4: Pain-Predominant Pattern (O3 in LogicTree)
  it('renders pain-predominant pattern correctly', () => {
    // Set up session storage with severe pain data
    window.sessionStorage.setItem('painLevel', JSON.stringify('severe'));
    
    renderWithProviders(<ResultsPage />, 'pain');
    
    // Check for pain pattern title and description
    expect(screen.getByText('Pain-Predominant Pattern')).toBeInTheDocument();
    expect(screen.getByText('Your menstrual pain is higher than typical and may interfere with daily activities.')).toBeInTheDocument();
    
    // Check recommendations specific to pain pattern
    expect(screen.getByText('Heat Therapy')).toBeInTheDocument();
    expect(screen.getByText('Pain Management')).toBeInTheDocument();
    expect(screen.getByText('Gentle Exercise')).toBeInTheDocument();
    expect(screen.getByText('Medical Support')).toBeInTheDocument();
  });

  // Pattern 5: Developing Pattern (O5 in LogicTree)
  it('renders developing pattern correctly', () => {
    // Set up session storage with adolescent data
    window.sessionStorage.setItem('age', JSON.stringify('13-17'));
    
    renderWithProviders(<ResultsPage />, 'developing');
    
    // Check for developing pattern title and description
    expect(screen.getByText('Developing Pattern')).toBeInTheDocument();
    expect(screen.getByText('Your cycles are still establishing a regular pattern, which is normal during adolescence.')).toBeInTheDocument();
    
    // Check recommendations specific to developing pattern
    expect(screen.getByText('Be Patient')).toBeInTheDocument();
    expect(screen.getByText('Track Your Cycle')).toBeInTheDocument();
    expect(screen.getByText('Learn About Your Body')).toBeInTheDocument();
    expect(screen.getByText('Talk to Someone You Trust')).toBeInTheDocument();
  });

  // Test symptoms display
  it('displays symptoms correctly', () => {
    // Set up session storage with symptoms data
    window.sessionStorage.setItem('symptoms', JSON.stringify({
      physical: ['Bloating', 'Headaches'],
      emotional: ['Mood swings']
    }));
    
    renderWithProviders(<ResultsPage />);
    
    // Check if symptoms are displayed
    expect(screen.getByText('Symptoms')).toBeInTheDocument();
    expect(screen.getByText(/Bloating, Headaches/)).toBeInTheDocument();
  });

  // Test save functionality using FlattenedAssessment format
  it('saves assessment in flattened format when clicking Save button', async () => {
    renderWithProviders(<ResultsPage />);
    
    // Click Save button
    fireEvent.click(screen.getByText('Save Results'));
    
    // Check that transformToFlattenedFormat was called
    await waitFor(() => {
      expect(getMockAssessmentResultContext().transformToFlattenedFormat).toHaveBeenCalled();
    });
    
    // Check that postSend was called with the correct flattened format
    await waitFor(() => {
      expect(postSend).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'mock-user-id',
        pattern: 'regular',
        cycle_length: '26-30',
        period_duration: '4-5',
        flow_heaviness: 'moderate',
        pain_level: 'mild'
      }));
    });
  });

  // Test that View History link navigates to the correct route
  it('navigates to history page when clicking View History', () => {
    renderWithProviders(<ResultsPage />);
    
    const historyLink = screen.getByText('View History').closest('a');
    expect(historyLink).toHaveAttribute('href', '/assessment/history');
  });
}); 